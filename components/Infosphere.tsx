import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2, Sparkles, MessageSquareText, Mic, MicOff, Volume2, UserCircle2, UserCircle, AudioLines, ChevronLeft, Brain } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface InfosphereProps {
  onClose: () => void;
}

const Infosphere: React.FC<InfosphereProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Infosphere online. I am your global intelligence hub. Speak or type, and I shall provide the insights you seek.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Manual implementation of raw PCM decoding for Gemini TTS
  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speakResponse = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const voiceName = voiceGender === 'female' ? 'Kore' : 'Fenrir';
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
      }
    } catch (e) {
      console.error("TTS Synthesis Error", e);
    }
  };

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || loading) return;

    const userMessage = textToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use Thinking Mode with Gemini 3 Pro for complex scholarly queries
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the Infosphere AI, a world-class academic intelligence. Use your thinking budget to provide deep, accurate, and concise insights. If responding to voice input, keep the final output brief and professional.",
        }
      });

      const aiText = response.text || "Connection lost. Please re-sync.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
      speakResponse(aiText);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection error. Re-sync required." }]);
    } finally {
      setLoading(false);
    }
  };

  const startTranscription = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await processVoiceInput(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsTranscribing(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopTranscription = () => {
    if (mediaRecorderRef.current && isTranscribing) {
      mediaRecorderRef.current.stop();
      setIsTranscribing(false);
    }
  };

  const processVoiceInput = async (base64Data: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Transcribe audio using gemini-3-flash-preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'audio/webm' } },
              { text: "Transcribe the user's spoken text accurately. Return only the transcription." }
            ]
          }
        ]
      });

      const transcript = response.text?.trim();
      if (transcript) {
        handleSend(transcript);
      }
    } catch (err) {
      console.error("Transcription error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[110] flex flex-col text-white animate-in slide-in-from-bottom-10 duration-700 overflow-hidden">
      <div className="p-8 pb-4 flex items-center justify-between shrink-0 bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95"><ChevronLeft size={24} /></button>
          <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-indigo-400/20">
            <MessageSquareText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-300 to-indigo-500">Infosphere</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-400/20 flex items-center gap-1">
                 <Brain size={8} className={loading ? 'animate-pulse' : ''} /> 
                 {loading ? 'Thinking Deeply...' : 'AI Thinking Mode Active'}
               </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mr-2 backdrop-blur-md">
              <button 
                onClick={() => setVoiceGender('female')}
                className={`p-2.5 rounded-xl transition-all ${voiceGender === 'female' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
                title="Voice: Kore"
              >
                <UserCircle size={20} />
              </button>
              <button 
                onClick={() => setVoiceGender('male')}
                className={`p-2.5 rounded-xl transition-all ${voiceGender === 'male' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-400'}`}
                title="Voice: Fenrir"
              >
                <UserCircle2 size={20} />
              </button>
           </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-32 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)]"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-800 border-white/10'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} className="text-indigo-300" />}
              </div>
              <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600/20 border border-indigo-500/30 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-indigo-300" />
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] rounded-tl-none text-slate-400 italic text-sm flex items-center gap-3">
                <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                Deep Network Thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none">
        <div className="max-w-xl mx-auto flex items-center gap-4 relative group pointer-events-auto">
          <button 
            onMouseDown={startTranscription}
            onMouseUp={stopTranscription}
            onTouchStart={startTranscription}
            onTouchEnd={stopTranscription}
            className={`p-6 rounded-full transition-all shadow-2xl ${isTranscribing ? 'bg-rose-500 animate-pulse scale-110 shadow-rose-500/40' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}
            title="Hold to Transcribe Voice"
          >
            {isTranscribing ? <AudioLines size={28} /> : <Mic size={28} />}
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isTranscribing ? "Listening to your voice..." : "Inquire with Thinking AI..."}
              className="w-full bg-white/5 border border-white/10 rounded-[2.2rem] py-6 pl-8 pr-20 text-sm font-bold text-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all placeholder:text-slate-600 uppercase tracking-tight"
            />
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/30 disabled:opacity-30 disabled:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
            </button>
          </div>
        </div>
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] text-center mt-6 flex items-center justify-center gap-3">
          <Sparkles size={10} className="text-indigo-500" />
          Powered by Gemini 3 Pro (32k Thinking) • Unified Voice Transcription
        </p>
      </div>
    </div>
  );
};

export default Infosphere;