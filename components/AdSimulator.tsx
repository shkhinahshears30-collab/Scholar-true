
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AdSimulator: React.FC<{ isPremium: boolean }> = ({ isPremium }) => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    if (isPremium) return;

    // Show ad every 10 minutes (600,000 ms) - for demo we show every 30s
    const timer = setInterval(() => {
      setShowAd(true);
    }, 30000);

    return () => clearInterval(timer);
  }, [isPremium]);

  if (!showAd) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full relative">
        <button 
          onClick={() => setShowAd(false)}
          className="absolute top-2 right-2 p-1 bg-black/10 rounded-full hover:bg-black/20"
        >
          <X size={20} />
        </button>
        <div className="p-8 text-center">
          <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center mb-4">
            <span className="text-slate-400 font-bold">Awesome Sponsor Ad</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Check this out!</h3>
          <p className="text-slate-600 mb-6">Upgrade to Ultra Scholar to remove these interruptions and get 2-hour sessions!</p>
          <button 
            onClick={() => setShowAd(false)}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Close Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdSimulator;
