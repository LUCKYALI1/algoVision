import React, { useState, useEffect } from 'react';

// You can replace this with your actual target launch date
const TARGET_DATE = new Date('September 1, 2025 00:00:00').getTime();

export default function Working() {
  const [timeLeft, setTimeLeft] = useState({});


  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ expired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (100 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);
  


  const CountdownUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span className="text-4xl sm:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/60">{String(value || 0).padStart(2, '0')}</span>
      <span className="text-xs text-white/50 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-gray-900">
        {/* Animated Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 animate-gradient-bg"></div>
        
        <style>{`
          @keyframes gradient-bg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-bg {
            background-size: 200% 200%;
            animation: gradient-bg 15s ease infinite;
          }
          .gear { animation: rotate 20s linear infinite; }
          .gear.reverse { animation-direction: reverse; }
          @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        
        <div className="relative z-10 w-full max-w-2xl mx-auto">
            <div className="bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 sm:p-12 text-center text-white border border-white/10">
                {/* Animated SVG Icon */}
                <div className="w-24 h-24 mx-auto mb-6 text-indigo-400">
                    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                        <g className="gear">
                          <path d="M99.5,64c0,2.4-0.1,4.9-0.4,7.3l12.3,9.6c3.2,2.5,4.1,7,2,10.2l-11.3,19.6c-2.1,3.2-6.7,4.1-10.2,2l-14.9-12   c-4.5,3.2-9.5,5.8-14.9,7.5l-2.3,16.2c-0.6,4.1-4.2,7.2-8.5,7.2h-23c-4.3,0-7.9-3-8.5-7.2l-2.3-16.2c-5.4-1.7-10.4-4.3-14.9-7.5   l-14.9,12c-3.5,2.1-8.1,1.2-10.2-2L4.5,93.1c-2.1-3.2-1.2-7.7,2-10.2l12.3-9.6C28.6,68.9,28.5,66.5,28.5,64   s0.1-4.9,0.4-7.3L16.6,47.1c-3.2-2.5-4.1-7-2-10.2L25.9,17.3c2.1-3.2,6.7-4.1,10.2-2l14.9,12c4.5-3.2,9.5-5.8,14.9-7.5l2.3-16.2   C68.8,3,72.4,0,76.7,0h23c4.3,0,7.9,3,8.5,7.2l2.3,16.2c5.4,1.7,10.4,4.3,14.9,7.5l14.9-12c3.5-2.1,8.1-1.2,10.2,2l11.3,19.6   c2.1,3.2,1.2,7.7-2,10.2L99.9,56.7C99.4,59.1,99.5,61.6,99.5,64z M64,44.5c-10.8,0-19.5,8.7-19.5,19.5S53.2,83.5,64,83.5   S83.5,74.8,83.5,64S74.8,44.5,64,44.5z" fill="currentColor"/>
                        </g>
                    </svg>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">Something New is Coming</h1>
                <p className="text-lg text-white/70 mb-8">
                    We're working hard behind the scenes to bring you an exciting new feature. It's not quite ready yet, but it's going to be worth the wait!
                </p>

                {/* Countdown Timer */}
                {!timeLeft.expired && (
                    <div className="flex justify-center gap-4 sm:gap-8 mb-8">
                        <CountdownUnit value={timeLeft.days} label="Days" />
                        <CountdownUnit value={timeLeft.hours} label="Hours" />
                        <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                        <CountdownUnit value={timeLeft.seconds} label="Seconds" />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}