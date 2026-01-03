
import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, MessageSquare, Loader2, PlayCircle, StopCircle, Radio } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

interface LiveTutorProps {
  onClose: () => void;
  language: string;
}

const LiveTutor: React.FC<LiveTutorProps> = ({ onClose, language }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Manual implementation of encode/decode as required by instructions
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; }
    }
    return buffer;
  }

  const startSession = async () => {
    setStatus('connecting');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    let nextStartTime = 0;
    const sources = new Set<AudioBufferSourceNode>();

    streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setStatus('active');
          const source = audioContextRef.current!.createMediaStreamSource(streamRef.current!);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            if (isMuted) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) { int16[i] = inputData[i] * 32768; }
            const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => [...prev.slice(-4), `Model: ${message.serverContent!.outputTranscription!.text}`]);
          } else if (message.serverContent?.inputTranscription) {
            setTranscription(prev => [...prev.slice(-4), `You: ${message.serverContent!.inputTranscription!.text}`]);
          }

          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData) {
            nextStartTime = Math.max(nextStartTime, outputContext.currentTime);
            const buffer = await decodeAudioData(decode(audioData), outputContext, 24000, 1);
            const source = outputContext.createBufferSource();
            source.buffer = buffer;
            source.connect(outputContext.destination);
            source.start(nextStartTime);
            nextStartTime += buffer.duration;
            sources.add(source);
            source.onended = () => sources.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sources.forEach(s => s.stop());
            sources.clear();
            nextStartTime = 0;
          }
        },
        onerror: () => setStatus('idle'),
        onclose: () => setStatus('idle'),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: `You are a helpful study companion in Scholar App. Converse naturally and supportively. Language: ${language}.`
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setStatus('idle');
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col p-8 text-white animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">
            <Radio size={24} className={status === 'active' ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h1 className="text-xl font-black italic uppercase">Live practice</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{status === 'active' ? 'Voice link established' : 'Gemini Native Audio'}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl"><X size={20} /></button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-20">
          <div className={`absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full transition-all duration-1000 ${status === 'active' ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}></div>
          <div className={`w-48 h-48 rounded-full border-2 border-indigo-500/30 flex items-center justify-center transition-all duration-700 ${status === 'active' ? 'bg-indigo-600/20 scale-110' : 'bg-white/5'}`}>
             <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${status === 'active' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                {status === 'connecting' ? <Loader2 size={48} className="animate-spin text-white" /> : <Volume2 size={48} className={status === 'active' ? 'animate-bounce' : 'text-slate-500'} />}
             </div>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-4 mb-12">
          {transcription.map((t, i) => (
            <p key={i} className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl ${t.startsWith('You') ? 'bg-white/5 text-slate-400' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
              {t}
            </p>
          ))}
          {status === 'active' && transcription.length === 0 && (
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Say hello to start...</p>
          )}
        </div>

        <div className="flex gap-6 items-center">
          {status === 'active' ? (
            <>
              <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-3xl transition-all ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white'}`}>
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button onClick={stopSession} className="p-8 bg-red-600 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-90 transition-all">
                <StopCircle size={32} />
              </button>
            </>
          ) : (
            <button 
              disabled={status === 'connecting'}
              onClick={startSession}
              className="bg-indigo-600 px-12 py-6 rounded-full font-black text-xl flex items-center gap-3 shadow-[0_0_40px_rgba(79,70,229,0.4)] active:scale-95 transition-all"
            >
              {status === 'connecting' ? 'CONNECTING...' : 'START VOICE PRACTICE'} <PlayCircle size={28} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTutor;
