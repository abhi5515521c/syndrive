"use client";

import { useScroll, useTransform, motion, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  Battery, Zap, MapPin, Navigation, Activity, ArrowRight, 
  Map, Sparkles, BarChart3, Network, Gauge, ShieldCheck, Thermometer
} from "lucide-react";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 100;

const getFramePath = (index: number) => {
  const padded = index.toString().padStart(3, "0");
  return `/assets/sequence/ezgif-frame-${padded}.jpg`;
};

export default function SynDriveLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [activeChargingNode, setActiveChargingNode] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    for (let i = FRAME_COUNT; i >= 1; i--) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      imgArray.push(img);
    }
    setImages(imgArray);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0 || imagesLoaded < FRAME_COUNT * 0.1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameIndex = Math.floor(latest * (FRAME_COUNT - 1));
    frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));

    const img = images[frameIndex];
    if (img && img.complete) {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  });

  useEffect(() => {
    if (imagesLoaded > 0 && images[0]) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx && images[0].complete) {
        const img = images[0];
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        } else {
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    }
  }, [imagesLoaded, images]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // UI opacity transforms strictly locked
  // 0-10%: HERO
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08, 0.10, 1], [1, 1, 0, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.10, 1], [0, -50, -50]);

  // 10-20%: LIVE BATTERY
  const batteryOpacity = useTransform(scrollYProgress, [0, 0.10, 0.12, 0.18, 0.20, 1], [0, 0, 1, 1, 0, 0]);
  const batteryY = useTransform(scrollYProgress, [0, 0.10, 0.12, 0.18, 0.20, 1], [20, 20, 0, 0, -20, -20]);

  // 20-30%: VEHICLE DATA
  const vehicleOpacity = useTransform(scrollYProgress, [0, 0.20, 0.22, 0.28, 0.30, 1], [0, 0, 1, 1, 0, 0]);
  const vehicleY = useTransform(scrollYProgress, [0, 0.20, 0.22, 0.28, 0.30, 1], [20, 20, 0, 0, -20, -20]);

  // 30-45%: ROUTE INTELLIGENCE
  const routeOpacity = useTransform(scrollYProgress, [0, 0.30, 0.33, 0.42, 0.45, 1], [0, 0, 1, 1, 0, 0]);
  const routeY = useTransform(scrollYProgress, [0, 0.30, 0.33, 0.42, 0.45, 1], [20, 20, 0, 0, -20, -20]);

  // 45-60%: CHARGING NETWORK
  const chargeOpacity = useTransform(scrollYProgress, [0, 0.45, 0.48, 0.57, 0.60, 1], [0, 0, 1, 1, 0, 0]);
  const chargeY = useTransform(scrollYProgress, [0, 0.45, 0.48, 0.57, 0.60, 1], [20, 20, 0, 0, -20, -20]);

  // 60-70%: AI SUGGESTIONS
  const aiOpacity = useTransform(scrollYProgress, [0, 0.60, 0.62, 0.68, 0.70, 1], [0, 0, 1, 1, 0, 0]);
  const aiY = useTransform(scrollYProgress, [0, 0.60, 0.62, 0.68, 0.70, 1], [20, 20, 0, 0, -20, -20]);

  // 70-80%: PERFORMANCE ANALYTICS
  const analyticsOpacity = useTransform(scrollYProgress, [0, 0.70, 0.72, 0.78, 0.80, 1], [0, 0, 1, 1, 0, 0]);
  const analyticsY = useTransform(scrollYProgress, [0, 0.70, 0.72, 0.78, 0.80, 1], [20, 20, 0, 0, -20, -20]);

  // 80-90%: FULL SYSTEM VIEW
  const systemOpacity = useTransform(scrollYProgress, [0, 0.80, 0.82, 0.88, 0.90, 1], [0, 0, 1, 1, 0, 0]);
  const systemY = useTransform(scrollYProgress, [0, 0.80, 0.82, 0.88, 0.90, 1], [20, 20, 0, 0, -20, -20]);

  // 90-100%: CTA
  const endOpacity = useTransform(scrollYProgress, [0, 0.90, 0.93, 1], [0, 0, 1, 1]);
  const endY = useTransform(scrollYProgress, [0, 0.90, 0.93, 1], [20, 20, 0, 0]);

  const navBackground = useTransform(
    scrollYProgress,
    [0, 0.05],
    ["rgba(10, 10, 12, 0)", "rgba(10, 10, 12, 0.7)"]
  );
  const navBorder = useTransform(
    scrollYProgress,
    [0, 0.05],
    ["rgba(59, 232, 255, 0)", "rgba(59, 232, 255, 0.1)"]
  );

  return (
    <div className="bg-syn-charcoal min-h-screen text-white font-sans antialiased selection:bg-syn-blue/30">
      
      <motion.nav
        style={{
          backgroundColor: navBackground,
          borderBottomWidth: "1px",
          borderBottomColor: navBorder,
          backdropFilter: "blur(12px)",
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all"
      >
        <div className="flex items-center drop-shadow-md">
          <img src="/logo.png" alt="SynDrive" className="h-32 w-auto -my-10 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] scale-110 origin-left" />
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <a href="#overview" className="hover:text-white transition-colors duration-300">Overview</a>
          <a href="#technology" className="hover:text-white transition-colors duration-300">Technology</a>
          <a href="#routing" className="hover:text-white transition-colors duration-300">Route Intelligence</a>
        </div>
        

      </motion.nav>

      {imagesLoaded < FRAME_COUNT * 0.1 && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-syn-charcoal text-white">
          <div className="w-16 h-16 border-4 border-syn-blue/30 border-t-syn-blue rounded-full animate-spin mb-4" />
          <p className="text-sm text-white/60 uppercase tracking-widest animate-pulse">Initializing SynOS...</p>
        </div>
      )}

      {/* Extended scroll container for 9 sections (800vh provides plenty of scroll depth) */}
      <div ref={containerRef} className="relative h-[800vh]">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,232,255,0.05)_0%,rgba(5,5,5,1)_60%)] z-0" />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-10 mix-blend-screen opacity-90"
          />

          <div className="absolute top-0 left-0 w-full h-full z-15 bg-black/30 pointer-events-none" />

          <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none px-6 md:px-24">
            
            {/* 0-10: HERO */}
            <motion.div
              style={{ opacity: heroOpacity, y: heroY }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center mt-32"
            >
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-syn-blue/10 animate-pulse" />
                <Activity size={14} className="text-syn-blue relative z-10" />
                <span className="text-xs font-semibold tracking-widest uppercase relative z-10">System Boot Initiated</span>
              </div>
              <motion.h1 
                className="text-6xl md:text-8xl font-bold tracking-tight mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
              >
                Drive the Future.<br />
                <span className="text-gradient">Intelligently.</span>
              </motion.h1>
              <motion.p className="text-xl md:text-2xl text-white/90 max-w-2xl font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Your EV, optimized by a living intelligence system.
              </motion.p>
              
              <div className="absolute bottom-24 flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Scroll to unpack</span>
                <div className="w-[2px] h-12 bg-gradient-to-b from-white/80 to-transparent" />
              </div>
            </motion.div>

            {/* 10-20: LIVE BATTERY */}
            <motion.div style={{ opacity: batteryOpacity, y: batteryY }} className="absolute left-6 md:left-24 top-1/4 max-w-md">
              <div className="bg-syn-secondary/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden group hover:border-syn-blue/50 transition-colors">
                <div className="absolute top-8 right-8 w-16 h-16 bg-syn-cyan/20 rounded-full blur-xl animate-pulse" />
                <Battery className="w-12 h-12 text-syn-cyan mb-6 relative z-10" />
                <h2 className="text-4xl font-bold mb-4 drop-shadow-md relative z-10">Know your charge.<br/>Always.</h2>
                <p className="text-lg text-white/80 font-medium leading-relaxed mb-6 drop-shadow-sm relative z-10">
                  Real-time molecular battery insights and predictive range models.
                </p>
                <div className="relative z-10 bg-black/40 p-5 rounded-2xl border border-white/10 group-hover:bg-black/60 transition-colors">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-syn-cyan text-5xl font-bold">84%</span>
                    <span className="text-white/60 mb-1 text-lg">502 km</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-syn-blue to-syn-cyan w-[84%] relative">
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 blur-[2px] animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 20-30: VEHICLE DATA */}
            <motion.div style={{ opacity: vehicleOpacity, y: vehicleY }} className="absolute right-6 md:right-24 top-1/4 max-w-md">
               <div className="bg-syn-secondary/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl group hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_30px_rgba(59,232,255,0.15)] transition-all duration-300">
                <Gauge className="w-12 h-12 text-white mb-6 group-hover:text-syn-blue transition-colors" />
                <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Your vehicle,<br/>in real time.</h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-8">
                    <span className="text-base font-medium text-white/60">Speed Limit</span>
                    <span className="text-xl font-bold">105 <span className="text-sm text-white/40">km/h</span></span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-8">
                    <span className="text-base font-medium text-white/60">Efficiency Avg</span>
                    <span className="text-xl font-bold text-syn-cyan">151 <span className="text-sm text-white/40">Wh/km</span></span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-8">
                    <span className="text-base font-medium text-white/60">Motor Temp</span>
                    <span className="text-xl font-bold flex items-center gap-1"><Thermometer size={16} className="text-red-400" /> 42°C</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 30-45: ROUTE INTELLIGENCE */}
            <motion.div style={{ opacity: routeOpacity, y: routeY }} className="absolute left-6 md:left-24 top-1/3 max-w-md">
              <div className="bg-syn-secondary/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <Navigation className="w-12 h-12 text-syn-blue mb-6 relative z-10" />
                <h2 className="text-4xl font-bold mb-4 drop-shadow-md relative z-10">Routes that<br/>think ahead.</h2>
                
                <div className="relative z-10 mt-6 bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-white relative">
                      <div className="absolute inset-0 bg-white animate-ping rounded-full" />
                    </div>
                    <div>
                      <span className="block text-base font-bold">Current Location</span>
                      <span className="block text-sm text-white/40">Chennai, TN</span>
                    </div>
                  </div>
                  <div className="ml-[5px] w-[2px] h-8 bg-white/20" />
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-syn-cyan ring-4 ring-syn-cyan/20" />
                    <div className="flex-1">
                      <span className="block text-base font-bold">Pondicherry</span>
                      <div className="flex justify-between items-center mt-1 text-xs">
                        <span className="text-white/60">~150 km via ECR • 2h 40m</span>
                        <span className="text-syn-cyan">14 chargers on route</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 45-60: CHARGING NETWORK */}
            <motion.div style={{ opacity: chargeOpacity, y: chargeY }} className="absolute right-6 md:right-24 top-1/4 max-w-lg pointer-events-auto">
              <div className="bg-syn-secondary/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                <Map className="w-12 h-12 text-syn-blue mb-6" />
                <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Charge smarter,<br/>not harder.</h2>
                <div className="space-y-3">
                  {[
                    { id: 1, name: "Shell Recharge – Panaiyur", dist: "22km", speed: "120kW", stalls: "2/2 available" },
                    { id: 2, name: "Statiq – Mahabalipuram", dist: "58km", speed: "50kW DC", stalls: "3/4 available" }
                  ].map((node) => (
                    <div 
                      key={node.id} 
                      onClick={() => setActiveChargingNode(activeChargingNode === node.id ? null : node.id)}
                      className={cn(
                        "p-4 rounded-xl border transition-all cursor-pointer",
                        activeChargingNode === node.id ? "bg-syn-blue/10 border-syn-blue" : "bg-black/30 border-white/5 hover:bg-black/50"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-sm tracking-wide">{node.name}</h3>
                          <span className="text-xs text-white/60">{node.dist} away</span>
                        </div>
                        <span className="text-syn-cyan text-sm font-black">{node.speed}</span>
                      </div>
                      <AnimatePresence>
                        {activeChargingNode === node.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/80">
                              <span>Status: {node.stalls}</span>
                              <button className="bg-white text-black px-3 py-1 rounded-full font-semibold">Reserve</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 60-70: AI SUGGESTIONS */}
            <motion.div style={{ opacity: aiOpacity, y: aiY }} className="absolute left-1/2 -translate-x-1/2 top-1/3 w-full max-w-2xl px-6">
              <div className="bg-black/80 backdrop-blur-2xl border border-syn-blue/30 rounded-full p-6 pl-8 pr-10 shadow-[0_0_40px_rgba(59,232,255,0.2)] flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-syn-blue to-syn-cyan flex shrink-0 items-center justify-center shadow-inner relative">
                  <Sparkles size={24} className="text-black relative z-10" />
                  <div className="absolute inset-0 rounded-full bg-syn-blue animate-ping opacity-50" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-white/40 mb-1">SynDrive Assistant</span>
                  <span className="text-xl font-medium tracking-tight text-white/90 drop-shadow-md">
                    "Depart by <span className="text-syn-cyan">6–8 AM</span> to avoid Chennai peak traffic. Shell Recharge at Panaiyur (22 km) is available."
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 70-80: PERFORMANCE ANALYTICS */}
            <motion.div style={{ opacity: analyticsOpacity, y: analyticsY }} className="absolute right-6 md:right-24 bottom-32 max-w-md w-full">
               <div className="bg-syn-secondary/40 backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-2xl">
                <BarChart3 className="w-12 h-12 text-white mb-6" />
                <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Every drive,<br/>optimized.</h2>
                <div className="mt-6 flex items-end gap-2 h-24 border-b border-white/10 pb-2">
                  {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/10 hover:bg-syn-blue/50 transition-colors rounded-t-sm" style={{ height: `${h}%` }}>
                      {i === 3 && <div className="w-full h-full bg-gradient-to-t from-syn-blue/20 to-syn-cyan" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40 font-medium">
                  <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                </div>
              </div>
            </motion.div>

            {/* 80-90: FULL SYSTEM VIEW */}
            <motion.div style={{ opacity: systemOpacity, y: systemY }} className="absolute inset-x-0 bottom-24 flex justify-center w-full px-6">
               <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl px-16 py-8 shadow-2xl flex items-center justify-center gap-8 md:gap-20 border-b-syn-blue/30 w-full max-w-4xl">
                 <div className="text-center">
                   <ShieldCheck className="w-8 h-8 text-syn-cyan mx-auto mb-3" />
                   <span className="text-sm uppercase tracking-widest text-white/60">Core Intact</span>
                 </div>
                 <div className="h-10 w-[1px] bg-white/20" />
                 <div className="text-center">
                   <Network className="w-8 h-8 text-syn-cyan mx-auto mb-3" />
                   <span className="text-sm uppercase tracking-widest text-white/60">Nodes Linked</span>
                 </div>
                 <div className="h-10 w-[1px] bg-white/20" />
                  <div className="text-center">
                   <Sparkles className="w-8 h-8 text-syn-cyan mx-auto mb-3" />
                   <span className="text-sm font-bold uppercase tracking-widest text-syn-cyan">Ecosystem Online</span>
                 </div>
               </div>
            </motion.div>

            {/* 90-100: CTA END */}
            <motion.div
              style={{ opacity: endOpacity, y: endY }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none px-6"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12 rounded-3xl text-center shadow-2xl max-w-md w-full mx-auto pointer-events-auto mt-24 hover:bg-black/50 transition-all hover:border-white/20">
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="mb-8 flex justify-center"
                >
                  <img src="/logo.png" alt="SynDrive" className="h-32 w-auto -my-10 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-125" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-3 drop-shadow-md">SynDrive OS</h2>
                <p className="text-white/80 font-medium text-base mb-8 drop-shadow-sm">Drive smarter. Go further.</p>
                <div className="flex flex-col gap-4 relative z-50">
                  <Link href="/login" className="group flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl text-lg">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>

    </div>
  );
}
