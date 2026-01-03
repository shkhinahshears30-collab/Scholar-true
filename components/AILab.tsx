
import React, { useState } from 'react';
/* Import Smartphone from lucide-react */
import { Sparkles, Camera, X, Play, Loader2, Wand2, ChevronRight, Download, Clapperboard, MonitorPlay, Smartphone } from 'lucide-react';
import { generateVeoVideo } from '../services/gemini';

interface AILabProps {
  onClose: () => void;
  isPremium: boolean;
}

const AILab: React.FC<AILabProps> = ({ onClose, isPremium }) => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!isPremium) { alert("Upgrade to Ultra for Veo Video Generation!"); return; }
    if (!base64Image) { alert("Please upload a starting photo."); return; }
    
    setLoading(true);
    setLoadingMsg("Uploading your photo to Veo...");
    
    const msgs = [
      "Analyzing colors and composition...",
      "Generating temporal consistency...",
      "Animating your story...",
      "Applying motion magic...",
      "Finalizing video bytes..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMsg(msgs[i % msgs.length]);
      i++;
    }, 12000);

    try {
      const url = await generateVeoVideo(base64Image, prompt, aspectRatio);
      setVideoUrl(url);
    } catch (e) {
      alert("Video generation failed. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[80] flex flex-col p-6 animate-in slide-in-from-bottom-10 duration-500 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg">
            <Clapperboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">Veo Lab</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Animate your study world</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400"><X size={20} /></button>
      </div>

      {!videoUrl ? (
        <div className="space-y-8 animate-in zoom-in-95">
          <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
            
            {base64Image ? (
              <div className="relative aspect-[16/9] w-full bg-black rounded-2xl overflow-hidden mb-6 border border-white/10">
                <img src={`data:image/jpeg;base64,${base64Image}`} className="w-full h-full object-cover" />
                <button onClick={() => setBase64Image(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"><X size={16} /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[16/9] border-2 border-dashed border-white/10 rounded-[2.5rem] cursor-pointer hover:bg-white/5 transition-colors mb-6">
                <Camera size={48} className="text-slate-700 mb-4" />
                <p className="text-sm font-black uppercase text-slate-500">Upload Photo to Animate</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            )}

            <div className="space-y-4">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the motion... (e.g. A gentle sunset breeze blowing through the trees)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none min-h-[100px]"
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${aspectRatio === '16:9' ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10'}`}
                >
                  <MonitorPlay size={14} className="mx-auto mb-1" /> Landscape 16:9
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase border transition-all ${aspectRatio === '9:16' ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10'}`}
                >
                  <Smartphone size={14} className="mx-auto mb-1" /> Portrait 9:16
                </button>
              </div>
            </div>
          </div>

          <button 
            disabled={loading || !base64Image}
            onClick={handleGenerate}
            className="w-full bg-purple-600 text-white py-8 rounded-[3rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 size={32} className="animate-spin mb-2" />
                <span className="text-xs font-bold animate-pulse">{loadingMsg}</span>
              </div>
            ) : (
              <>GENERATE VEO VIDEO <Clapperboard size={24} className="group-hover:rotate-12 transition-transform" /></>
            )}
          </button>
          
          <p className="text-[10px] text-slate-400 font-black text-center uppercase tracking-widest leading-relaxed">
            Powered by Veo 3.1 Fast Preview<br/>Premium Tier Required for Access
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-in zoom-in-95">
           <div className="bg-black rounded-[3rem] overflow-hidden shadow-2xl relative">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className={`w-full ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] h-[60vh] object-cover'}`}
              />
           </div>
           
           <div className="mt-8 space-y-4">
              <a 
                href={videoUrl} 
                download="veo-scholar.mp4"
                className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-xl"
              >
                <Download size={20} /> DOWNLOAD MP4
              </a>
              <button 
                onClick={() => setVideoUrl(null)}
                className="w-full bg-white border border-slate-100 py-6 rounded-[2.5rem] font-black text-slate-400"
              >
                START NEW GENERATION
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AILab;
