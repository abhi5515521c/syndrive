"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Battery, Zap, MapPin, Navigation, Activity, ArrowRight,
  Settings, Map, BarChart3, Network, Gauge, 
  Thermometer, Command, Search, Route, ChevronDown, Clock, AlertTriangle, Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

// ────────────────────────────────────────────────────────────
//  DESTINATION DATA
// ────────────────────────────────────────────────────────────

const DESTINATIONS = {
  pondicherry: {
    label: "Pondicherry",
    emoji: "🏖️",
    routeSummary: {
      optimalRoute: "ECR (East Coast Road) – NH 32",
      totalDistance: "~150 km",
      alternativeRoute: "NH 32 via Tindivanam (~165 km)",
      estimatedTime: "2.5 – 3.5 hours",
      roadQuality: "Excellent (4-lane stretch most of ECR)",
      tollCharges: "₹80 – ₹120 (2 toll plazas)",
      bestDepartureTime: "6:00 – 8:00 AM",
      chargerCount: "~14 public stations",
    },
    mapMidLabel: "MAHABALIPURAM",
    mapDestLabel: "PONDICHERRY",
    mapRoute: "ECR – NH 32",
    etaText: "~150 km • 2h 40m – 3h 30m",
    waypoints: [
      { name: "Chennai (Start – Adyar/ECR)", km: 0, info: "Departure point; check battery charge" },
      { name: "Sholinganallur / OMR Junction", km: 18, info: "Last major service hub in city" },
      { name: "Kelambakkam", km: 25, info: "Crocodile Bank; fuel & food stops" },
      { name: "Muttukadu", km: 30, info: "Dakshina Chitra heritage museum" },
      { name: "Mahabalipuram", km: 58, info: "UNESCO Shore Temple; key EV charger stop" },
      { name: "Kalpakkam", km: 75, info: "Nuclear Power Plant area; coastal drive" },
      { name: "Marakkanam", km: 115, info: "Salt pans; local eateries" },
      { name: "Pondicherry (Arrival)", km: 150, info: "French Quarter, White Town" },
    ],
    chargingStations: [
      { id: 1, name: "Shell Recharge – Panaiyur", location: "Panaiyur, ECR", km: 22, type: "DC Fast", power: "120kW", connector: "CCS2/CHAdeMO", app: "Shell Recharge", available: 2, total: 2 },
      { id: 2, name: "Shell Recharge – Kanathur", location: "ECR Rd, Kanathur", km: 28, type: "DC Fast", power: "50kW", connector: "CCS2", app: "Shell Recharge", available: 1, total: 2 },
      { id: 3, name: "Statiq – Mahabalipuram", location: "Four Points by Sheraton", km: 58, type: "DC Fast + AC", power: "50kW DC / 22kW AC", connector: "CCS2/Type-2", app: "Statiq", available: 3, total: 4 },
      { id: 4, name: "Tata Power – Mahabalipuram", location: "Beach Road", km: 58, type: "DC Fast", power: "60kW", connector: "CCS2/CHAdeMO", app: "Tata EZ Charge", available: 1, total: 2 },
      { id: 5, name: "ChargeZone – Kalpakkam", location: "NH-32, Kalpakkam", km: 75, type: "DC Fast", power: "50kW", connector: "CCS2", app: "ChargeZone", available: 2, total: 3 },
      { id: 6, name: "Statiq – Marakkanam", location: "NH-32, Marakkanam", km: 115, type: "AC Slow", power: "22kW", connector: "Type-2", app: "Statiq", available: 1, total: 1 },
      { id: 7, name: "Tata Power – Pondicherry", location: "Near White Town", km: 150, type: "DC Fast", power: "60kW", connector: "CCS2/CHAdeMO", app: "Tata EZ Charge", available: 2, total: 3 },
      { id: 8, name: "ChargeZone – Pondicherry", location: "MG Road / Mission St", km: 150, type: "DC Fast + AC", power: "50kW DC / 22kW AC", connector: "CCS2/Type-2", app: "ChargeZone", available: 4, total: 4 },
    ],
    journeySegments: [
      { from: "Chennai", to: "Mahabalipuram", distance: "~58 km", driveTime: "~1 hr 10 min", stopType: "Optional EV Charge / Sightseeing", stopDuration: "30–60 min", notes: "Shore Temple, seafood stop" },
      { from: "Mahabalipuram", to: "Marakkanam", distance: "~57 km", driveTime: "~55 min", stopType: "No stop needed", stopDuration: "—", notes: "Scenic coastal drive" },
      { from: "Marakkanam", to: "Pondicherry", distance: "~35 km", driveTime: "~35 min", stopType: "Arrival buffer", stopDuration: "—", notes: "Enter Pondicherry city" },
    ],
    evModels: [
      { name: "Tata Nexon EV LR", ratedRange: 465, realRange: "320–360 km", battery: "40.5 kWh", feasibility: "Excellent", needsStop: false },
      { name: "MG ZS EV (2024)", ratedRange: 461, realRange: "320–360 km", battery: "50.3 kWh", feasibility: "Excellent", needsStop: false },
      { name: "Hyundai Ioniq 5", ratedRange: 631, realRange: "420–480 km", battery: "72.6 kWh", feasibility: "Excellent", needsStop: false },
      { name: "Kia EV6", ratedRange: 708, realRange: "480–520 km", battery: "77.4 kWh", feasibility: "Excellent", needsStop: false },
      { name: "Mahindra XUV400 Pro", ratedRange: 456, realRange: "300–360 km", battery: "39.4 kWh", feasibility: "Excellent", needsStop: false },
      { name: "Citroen eC3", ratedRange: 320, realRange: "220–260 km", battery: "29.2 kWh", feasibility: "Good", needsStop: true },
    ],
    emergencyContacts: [
      { service: "Tata Power EZ Charge", contact: "1800-209-8765", hours: "24×7" },
      { service: "Shell Recharge India", contact: "1800-102-3233", hours: "24×7" },
      { service: "Road Assistance (NHAI)", contact: "1033", hours: "24×7" },
      { service: "TN Police (Highway)", contact: "100 / 9498108100", hours: "24×7" },
    ],
  },
  munnar: {
    label: "Munnar",
    emoji: "🌿",
    routeSummary: {
      optimalRoute: "NH179B → NH38 → NH85 (via Bodi Ghat)",
      totalDistance: "~583 km",
      alternativeRoute: "Via Palani / Udumalpet (~596 km)",
      estimatedTime: "10 – 12 hours driving",
      roadQuality: "NH sections excellent; ghat roads require care",
      tollCharges: "₹200 – ₹350 (multiple toll plazas)",
      bestDepartureTime: "5:00 AM (avoid city traffic; arrive before dark)",
      chargerCount: "4–5 mandatory stops",
    },
    mapMidLabel: "TRICHY",
    mapDestLabel: "MUNNAR",
    mapRoute: "NH38 / NH85 – Bodi Ghat",
    etaText: "~583 km • 12 – 14 hrs total",
    waypoints: [
      { name: "Chennai (Tambaram)", km: 0, info: "Departure; start on NH179B" },
      { name: "Tindivanam", km: 75, info: "Toll plaza at Maraimalai Nagar" },
      { name: "Villupuram", km: 110, info: "4-lane highway; EV charging available" },
      { name: "Trichy", km: 315, info: "Key charge stop; lunch break recommended" },
      { name: "Dindigul", km: 353, info: "Kodaikanal junction at Batlagundu" },
      { name: "Theni", km: 453, info: "CRITICAL charge stop before ghat section" },
      { name: "Bodimettu (Ghat)", km: 533, info: "Scenic hairpin bends; speed 30 km/h" },
      { name: "Devikulam", km: 563, info: "AC charge; tea estate views begin" },
      { name: "Munnar (Arrival)", km: 583, info: "Hill station; book EV-friendly hotel" },
    ],
    chargingStations: [
      { id: 1, name: "Shell Recharge – Arcot Road", location: "Chennai", km: 5, type: "AC + DC", power: "22 / 50kW", connector: "Type-2 / CCS2", app: "Shell Recharge", available: 2, total: 2 },
      { id: 2, name: "EESL – Egmore CMRL Parking", location: "Chennai", km: 10, type: "DC Fast", power: "60kW", connector: "CCS2", app: "Statiq", available: 2, total: 3 },
      { id: 3, name: "IOCL Fuel Station – NH179B", location: "Tindivanam", km: 140, type: "DC Fast", power: "50kW", connector: "CCS2", app: "Tata EZ Charge", available: 1, total: 2 },
      { id: 4, name: "Tata Motors Showroom – NH 38", location: "Trichy", km: 310, type: "DC Fast", power: "50kW", connector: "CCS2", app: "Tata EZ Charge", available: 2, total: 2 },
      { id: 5, name: "EESL Station – Trichy Municipal", location: "Trichy", km: 312, type: "DC Fast", power: "60kW", connector: "CCS2", app: "EESL", available: 1, total: 2 },
      { id: 6, name: "Ather – Dindigul Palani Road", location: "Dindigul", km: 370, type: "AC", power: "7.4kW", connector: "Type-2", app: "Ather Grid", available: 2, total: 2 },
      { id: 7, name: "EV Fast Charger – NH Theni Bypass", location: "Theni", km: 450, type: "DC Fast", power: "50kW", connector: "CCS2/CHAdeMO", app: "ChargeZone", available: 2, total: 3 },
      { id: 8, name: "Devikulam EV Station (KSEB)", location: "Devikulam", km: 555, type: "AC / DC", power: "15–30kW", connector: "Type-2 / CCS2", app: "KSEB", available: 1, total: 2 },
    ],
    journeySegments: [
      { from: "Chennai", to: "Trichy", distance: "~315 km", driveTime: "~4.5 hrs", stopType: "Charge Stop 1 + Lunch", stopDuration: "~1.75 hrs", notes: "Depart 5 AM; charge at Tata Motors Trichy" },
      { from: "Trichy", to: "Theni", distance: "~138 km", driveTime: "~3 hrs", stopType: "Charge Stop 2 – CRITICAL", stopDuration: "~1 hr", notes: "Must fully charge before ghat section" },
      { from: "Theni", to: "Munnar via Ghat", distance: "~130 km", driveTime: "~3.5 hrs", stopType: "AC Charge at Devikulam", stopDuration: "~45 min", notes: "Scenic Bodi Ghat; slow drive; tea estates" },
    ],
    evModels: [
      { name: "Tata Nexon EV LR", ratedRange: 465, realRange: "300–350 km", battery: "40.5 kWh", feasibility: "Good", needsStop: true },
      { name: "MG ZS EV (2024)", ratedRange: 461, realRange: "320–370 km", battery: "50.3 kWh", feasibility: "Good", needsStop: true },
      { name: "Hyundai Ioniq 5", ratedRange: 631, realRange: "420–480 km", battery: "72.6 kWh", feasibility: "Excellent", needsStop: false },
      { name: "Kia EV6", ratedRange: 708, realRange: "450–500 km", battery: "77.4 kWh", feasibility: "Excellent", needsStop: false },
      { name: "Tata Tiago EV", ratedRange: 315, realRange: "200–240 km", battery: "24 kWh", feasibility: "Challenging", needsStop: true },
      { name: "Mahindra XUV400 Pro", ratedRange: 456, realRange: "280–320 km", battery: "39.4 kWh", feasibility: "Good", needsStop: true },
    ],
    emergencyContacts: [
      { service: "KSEB EV Support (Kerala)", contact: "1912", hours: "24×7" },
      { service: "Tata Power EZ Charge", contact: "1800-209-8765", hours: "24×7" },
      { service: "Road Assistance (NHAI)", contact: "1033", hours: "24×7" },
      { service: "Kerala Police (Highway)", contact: "100 / 9497977789", hours: "24×7" },
    ],
  },
};

type DestKey = keyof typeof DESTINATIONS;

export default function Dashboard() {
  const [speed, setSpeed] = useState(0);
  const [battery, setBattery] = useState(84);
  const [efficiency, setEfficiency] = useState(151);
  const [range, setRange] = useState(502);
  const [motorTemp, setMotorTemp] = useState(42);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [destination, setDestination] = useState<DestKey>("pondicherry");
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [expandedStation, setExpandedStation] = useState<number | null>(null);

  const dest = DESTINATIONS[destination];
  const CHARGING_STATIONS = dest.chargingStations;
  const WAYPOINTS = dest.waypoints;
  const JOURNEY_SEGMENTS = dest.journeySegments;
  const EV_MODELS = dest.evModels;
  const EMERGENCY_CONTACTS = dest.emergencyContacts;
  const ROUTE_SUMMARY = dest.routeSummary;

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => Math.max(0, Math.min(85, Math.floor(prev === 0 ? 45 : prev + (Math.random() * 10 - 3)))));
      setEfficiency(prev => Math.floor(prev + (Math.random() * 4 - 2)));
      setMotorTemp(prev => Math.max(38, Math.min(65, Math.floor(prev + (Math.random() * 2 - 1)))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Parallax for Vehicle
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-500, 500], [5, -5]);
  const rotateY = useTransform(smoothX, [-500, 500], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  return (
    <div className="bg-syn-charcoal min-h-screen text-white font-sans overflow-hidden flex selection:bg-syn-cyan/30" onMouseMove={handleMouseMove}>
      
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,232,255,0.05)_0%,rgba(5,5,5,1)_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      {/* SIDEBAR NAV */}
      <nav className="w-24 border-r border-white/5 flex flex-col items-center py-8 z-50 bg-black/40 backdrop-blur-3xl shrink-0 h-screen relative">
        <div className="mb-12">
          <img src="/logo.png" alt="SynDrive" className="w-12 h-12 object-contain" />
        </div>
        <div className="flex flex-col gap-6 flex-1 w-full items-center">
          {[
            { id: "dashboard", icon: Command },
            { id: "route", icon: Navigation },
            { id: "charging", icon: Zap },
            { id: "analytics", icon: BarChart3 },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("p-4 rounded-2xl transition-all duration-300 relative group", activeTab === item.id ? "text-syn-cyan bg-syn-blue/10" : "text-white/40 hover:text-white hover:bg-white/5")}>
              {activeTab === item.id && <motion.div layoutId="navIndicator" className="absolute inset-0 rounded-2xl border border-syn-cyan/50 shadow-[0_0_15px_rgba(0,214,255,0.2)]" />}
              <item.icon size={24} className="relative z-10" />
            </button>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-6 w-full items-center">
          <button className="p-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"><Settings size={24} /></button>
          <button className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 hover:border-syn-cyan transition-colors">
            <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="absolute top-0 left-0 right-0 h-24 flex items-center justify-between px-10 z-40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">{activeTab === 'dashboard' ? 'System Online' : activeTab === 'route' ? 'Route Planner' : activeTab === 'charging' ? 'Charging Network' : 'Performance Telemetry'}</h1>
            <p className="text-sm text-white/50">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • Chennai, TN</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Destination Selector */}
            <div className="relative">
              <button
                onClick={() => setDestDropdownOpen(o => !o)}
                className="flex items-center gap-2.5 bg-black/50 backdrop-blur-xl border border-syn-cyan/30 rounded-2xl px-4 py-2.5 text-sm font-semibold hover:border-syn-cyan/60 transition-all shadow-[0_0_15px_rgba(0,214,255,0.1)]"
              >
                <MapPin size={15} className="text-syn-cyan" />
                <span className="text-white/60 text-xs">To:</span>
                <span>{dest.emoji} {dest.label}</span>
                <ChevronDown size={14} className={cn("text-white/40 transition-transform", destDropdownOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {destDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-w-[180px] z-50"
                  >
                    {(Object.keys(DESTINATIONS) as DestKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setDestination(key); setDestDropdownOpen(false); setExpandedStation(null); }}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all hover:bg-white/5",
                          destination === key ? "text-syn-cyan bg-syn-cyan/5" : "text-white/70"
                        )}
                      >
                        <span className="text-lg">{DESTINATIONS[key].emoji}</span>
                        <div>
                          <div className="font-semibold">{DESTINATIONS[key].label}</div>
                          <div className="text-[10px] text-white/40">{DESTINATIONS[key].routeSummary.totalDistance}</div>
                        </div>
                        {destination === key && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-syn-cyan" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5">
              <Thermometer size={18} className="text-white/60" />
              <span className="text-sm font-semibold">22°C Cabin</span>
            </div>
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5">
              <Network size={18} className="text-syn-cyan" />
              <span className="text-sm font-semibold text-syn-cyan">SynOS Link Active</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="popLayout">

          {/* ═══════════════════ DASHBOARD TAB ═══════════════════ */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="absolute inset-0">
              
              {/* Vehicle Center */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <motion.div style={{ rotateX, rotateY }} className="relative w-[800px] h-[500px] flex items-center justify-center pointer-events-auto">
                  <div className="absolute bottom-10 w-[600px] h-32 bg-syn-cyan/20 blur-[80px] rounded-full" />
                  <motion.img src="/assets/sequence/ezgif-frame-001.jpg" alt="EV Vehicle" className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_50px_rgba(59,232,255,0.1)]" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} />
                  
                  <motion.div className="absolute top-0 left-[15%] flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"><Gauge size={20} /></div>
                    <div>
                      <span className="block text-[10px] uppercase text-white/40 tracking-wider">Speed</span>
                      <span className="text-2xl font-bold">{speed} <span className="text-sm font-normal text-white/50">km/h</span></span>
                    </div>
                  </motion.div>

                  <motion.div className="absolute top-0 right-[15%] flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                    <div className="w-10 h-10 rounded-full bg-syn-cyan/10 flex items-center justify-center"><Activity size={20} className="text-syn-cyan" /></div>
                    <div>
                      <span className="block text-[10px] uppercase text-white/40 tracking-wider">Efficiency</span>
                      <span className="text-2xl font-bold text-syn-cyan">{efficiency} <span className="text-sm font-normal text-white/50">Wh/km</span></span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* LEFT: Battery + AI */}
              <div className="absolute left-10 top-32 bottom-10 w-80 flex flex-col gap-6 z-30">
                
                {/* Battery Orb */}
                <div className="bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group hover:border-white/20 transition-all shrink-0">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity"><Zap size={24} className="text-syn-cyan animate-pulse" /></div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50 mb-6">Energy Core</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                        <motion.circle cx="50" cy="50" r="46" fill="none" stroke="#00d6ff" strokeWidth="6" strokeDasharray="289" animate={{ strokeDashoffset: 289 - (289 * battery) / 100 }} transition={{ duration: 2 }} strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(0,214,255,0.6)]" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold">{battery}%</span></div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-white/40 tracking-widest">Est. Range</span>
                      <span className="text-4xl font-bold tracking-tighter block">{range}<span className="text-lg text-white/50 ml-1">km</span></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white text-black py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-white/90 cursor-pointer">Charge</button>
                    <button className="flex-1 bg-black/50 border border-white/10 py-2.5 rounded-xl text-sm font-bold hover:bg-white/5 cursor-pointer">Precondition</button>
                  </div>
                </div>

                {/* Nearby Chargers */}
                <div className="flex-1 bg-gradient-to-b from-white/[0.05] to-transparent backdrop-blur-2xl border border-white/10 rounded-3xl pt-6 flex flex-col shadow-2xl overflow-hidden min-h-0">
                  <div className="flex justify-between items-end mb-4 px-6 shrink-0">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50">Nearby Chargers</h3>
                    <span onClick={() => setActiveTab('charging')} className="text-xs text-syn-cyan font-semibold cursor-pointer hover:text-white transition-colors">View All ({CHARGING_STATIONS.length})</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 px-6 pb-2">
                    {CHARGING_STATIONS.slice(0, 3).map((s) => (
                      <div key={s.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl hover:border-syn-cyan/30 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm text-white/90 group-hover:text-white">{s.name}</h4>
                          <span className="text-xs font-bold text-syn-cyan bg-syn-cyan/10 px-2 py-0.5 rounded-full">{s.power}</span>
                        </div>
                        <div className="flex justify-between text-xs text-white/50">
                          <span>{s.km} km • {s.connector}</span>
                          <span className={s.available > 0 ? "text-green-400" : "text-red-400"}>{s.available}/{s.total} Avail</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto px-6 pb-6 pt-4 border-t border-white/5 shrink-0 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-white/60">{dest.routeSummary.chargerCount}</span>
                  </div>
                </div>

              </div>

              {/* RIGHT: Map */}
              <div className="absolute right-10 top-32 bottom-10 w-96 flex flex-col gap-6 z-30 pointer-events-auto">
                <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer" onClick={() => setActiveTab('route')}>
                  <div className="absolute inset-0 bg-[#0a0a0c]">
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
                      <path d="M 50 500 C 80 400, 150 300, 200 250 S 300 150, 350 100 S 380 50, 380 50" fill="none" stroke="#00d6ff" strokeWidth="6" className="drop-shadow-[0_0_12px_rgba(0,214,255,0.6)]" />
                      <circle cx="50" cy="500" r="8" fill="#fff" />
                      <circle cx="200" cy="250" r="9" fill="#1a1a1a" stroke="#00d6ff" strokeWidth="3" />
                      <path d="M197 245 L203 245 L200 250 L204 250 L198 258 L200 251 L196 251 Z" fill="#00d6ff" />
                      <circle cx="380" cy="50" r="8" fill="#00d6ff" className="animate-ping" />
                      <circle cx="380" cy="50" r="5" fill="#fff" />
                    </svg>
                    <div className="absolute top-[45%] left-[40%] text-[10px] text-syn-cyan/80 font-bold tracking-wider">{dest.mapMidLabel}</div>
                    <div className="absolute top-[85%] left-[15%] text-[10px] text-white/60 font-bold tracking-wider">CHENNAI</div>
                    <div className="absolute top-[5%] right-[5%] text-[10px] text-white/60 font-bold tracking-wider">{dest.mapDestLabel}</div>
                  </div>
                  <div className="absolute top-6 left-6"><div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"><Route size={14} className="text-syn-cyan" /> {dest.mapRoute}</div></div>
                  <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex justify-between items-center group-hover:border-white/20 transition-all shadow-xl">
                    <div>
                      <h4 className="font-bold text-base">{dest.label}</h4>
                      <p className="text-sm text-white/50 mt-1">{dest.etaText.split('•')[0].trim()} • <span className="text-syn-cyan">{dest.etaText.split('•')[1]?.trim()}</span></p>
                    </div>
                    <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-syn-cyan transition-all"><ArrowRight size={20} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ ROUTE PLANNER TAB ═══════════════════ */}
          {activeTab === "route" && (
            <motion.div key="route" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center py-24 px-10 z-20 pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl w-full h-full flex overflow-hidden">
                
                {/* Left: Route Details */}
                <div className="w-[420px] border-r border-white/10 bg-black/60 p-8 flex flex-col z-10 shrink-0 overflow-y-auto">
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3"><Navigation className="text-syn-blue w-8 h-8" /> Route Planner</h2>
                  <p className="text-sm text-white/50 mb-8">{ROUTE_SUMMARY.optimalRoute} • {ROUTE_SUMMARY.totalDistance}</p>
                  
                  {/* Waypoints */}
                  <div className="relative space-y-5 mb-8 flex-1">
                    <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-syn-blue via-syn-cyan/30 to-white/10" />
                    
                    {WAYPOINTS.map((wp, i) => (
                      <div key={i} className="relative pl-10">
                        <div className={cn(
                          "absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border",
                          i === 0 ? "bg-syn-blue/20 border-syn-blue" : i === WAYPOINTS.length - 1 ? "bg-white/10 border-white" : wp.km === 58 ? "bg-syn-cyan/20 border-syn-cyan" : "bg-black/40 border-white/30"
                        )}>
                          {i === 0 && <div className="w-2 h-2 rounded-full bg-syn-blue animate-pulse" />}
                          {i === WAYPOINTS.length - 1 && <MapPin size={14} className="text-white" />}
                          {wp.km === 58 && i !== 0 && <Zap size={12} className="text-syn-cyan" />}
                          {wp.km !== 58 && i !== 0 && i !== WAYPOINTS.length - 1 && <div className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                        </div>
                        <div className="font-bold text-sm text-white/90">{wp.name}</div>
                        <div className="text-xs text-white/40 mt-0.5">{wp.km} km from start • {wp.info}</div>
                      </div>
                    ))}
                  </div>

                  {/* Journey Segments */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-2 flex items-center gap-2"><Clock size={12}/> Journey Breakdown</h4>
                    {JOURNEY_SEGMENTS.map((seg, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-3 last:pb-0">
                        <div>
                          <span className="font-medium text-white/80">{seg.from} → {seg.to}</span>
                          <span className="text-xs text-white/40 block mt-0.5">{seg.notes}</span>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="text-white/80 font-bold">{seg.distance}</span>
                          <span className="text-xs text-syn-cyan block">{seg.driveTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Route Stats */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                      <span className="text-white/60">Total Distance</span>
                      <span className="font-bold text-xl">{ROUTE_SUMMARY.totalDistance}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                      <span className="text-white/60">Toll Charges</span>
                      <span className="font-bold text-lg">{ROUTE_SUMMARY.tollCharges}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Est. Time</span>
                      <span className="font-bold text-xl text-syn-cyan">{ROUTE_SUMMARY.estimatedTime}</span>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-neutral-200 transition-colors cursor-pointer">Start Navigation</button>
                </div>

                {/* Right: Map */}
                <div className="flex-1 relative bg-[#050505]">
                  <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 800">
                    {/* Main Route Path */}
                    <path d="M 80 700 C 150 680, 200 620, 300 550 S 450 400, 550 350 S 700 250, 800 200 S 900 130, 950 110" fill="none" stroke="#00d6ff" strokeWidth="6" className="drop-shadow-[0_0_15px_rgba(0,214,255,0.5)]" />
                    
                    {/* Chennai */}
                    <circle cx="80" cy="700" r="14" fill="#00d6ff" className="animate-pulse" />
                    <circle cx="80" cy="700" r="6" fill="#fff" />
                    <text x="105" y="705" fill="white" fontSize="14" fontWeight="bold">Chennai (Start)</text>

                    {/* Sholinganallur - 18km */}
                    <circle cx="180" cy="660" r="4" fill="white" opacity="0.4" />
                    <text x="195" y="665" fill="white" fontSize="10" opacity="0.5">Sholinganallur</text>

                    {/* Kelambakkam - 25km */}
                    <circle cx="220" cy="640" r="4" fill="white" opacity="0.4" />

                    {/* Mahabalipuram - 58km (Charging) */}
                    <circle cx="380" cy="480" r="16" fill="#1a1a1a" stroke="#00d6ff" strokeWidth="3" />
                    <path d="M376 474 L382 474 L379 480 L384 480 L377 488 L379 481 L374 481 Z" fill="#00d6ff" />
                    <text x="405" y="478" fill="#00d6ff" fontSize="13" fontWeight="bold">Mahabalipuram</text>
                    <text x="405" y="494" fill="white" fontSize="10" opacity="0.5">Shell / Statiq / Tata Power</text>

                    {/* Kalpakkam - 75km */}
                    <circle cx="500" cy="380" r="6" fill="#1a1a1a" stroke="#fff" strokeWidth="2" />
                    <text x="515" y="385" fill="white" fontSize="10" opacity="0.5">Kalpakkam</text>

                    {/* Marakkanam - 115km */}
                    <circle cx="720" cy="230" r="6" fill="#1a1a1a" stroke="#fff" strokeWidth="2" />
                    <text x="735" y="235" fill="white" fontSize="10" opacity="0.5">Marakkanam</text>

                    {/* Pondicherry */}
                    <circle cx="950" cy="110" r="14" fill="#fff" />
                    <circle cx="950" cy="110" r="6" fill="#1a1a1a" />
                    <text x="860" y="105" fill="white" fontSize="14" fontWeight="bold">Pondicherry</text>
                    <text x="860" y="120" fill="white" fontSize="10" opacity="0.5">French Quarter</text>
                  </svg>

                  {/* Map Legend */}
                  <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-syn-cyan" /><span className="text-white/70">EV Charging Station</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white/40" /><span className="text-white/70">Waypoint</span></div>
                    <div className="flex items-center gap-2"><div className="w-6 h-1 bg-syn-cyan rounded-full" /><span className="text-white/70">ECR Route</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ CHARGING NETWORK TAB ═══════════════════ */}
          {activeTab === "charging" && (
            <motion.div key="charging" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center py-24 px-10 z-20 pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl w-full h-full flex flex-col p-10 overflow-hidden">
                
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-4xl font-bold mb-2 flex items-center gap-3"><Zap className="text-syn-cyan w-10 h-10" /> ECR Charging Corridor</h2>
                    <p className="text-white/50 text-lg">{ROUTE_SUMMARY.chargerCount} along Chennai → Pondicherry ECR route</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full">🟢 Available</span>
                    <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full">🔴 In Use</span>
                    <span className="flex items-center gap-1.5 bg-white/10 text-white/60 border border-white/20 px-3 py-1.5 rounded-full">⚫ Offline</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto pb-10 flex-1">
                  {CHARGING_STATIONS.map((s) => (
                    <div key={s.id} onClick={() => setExpandedStation(expandedStation === s.id ? null : s.id)} className={cn("bg-black/40 border rounded-3xl p-6 transition-all cursor-pointer group flex flex-col", expandedStation === s.id ? "border-syn-cyan/50 bg-syn-cyan/[0.03]" : "border-white/10 hover:bg-white/5 hover:border-white/20")}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold leading-tight group-hover:text-syn-cyan transition-colors">{s.name}</h3>
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", s.available > 0 ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10")}>{s.available > 0 ? "🟢" : "🔴"}</span>
                      </div>
                      <span className="text-sm text-white/50 mb-auto">{s.location} • {s.km} km</span>
                      
                      <div className="mt-6 border-t border-white/10 pt-4 flex items-end justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Power</span>
                          <span className="text-2xl font-black">{s.power}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Stalls</span>
                          <span className={cn("text-2xl font-bold", s.available > 0 ? "text-syn-cyan" : "text-red-400")}>{s.available}<span className="text-lg text-white/30">/{s.total}</span></span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedStation === s.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-white/60">
                              <div className="flex justify-between"><span>Connector</span><span className="text-white/80 font-semibold">{s.connector}</span></div>
                              <div className="flex justify-between"><span>Type</span><span className="text-white/80 font-semibold">{s.type}</span></div>
                              <div className="flex justify-between"><span>App</span><span className="text-syn-cyan font-semibold">{s.app}</span></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Emergency Contacts */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-white/40"><Phone size={14} /> Emergency:</div>
                  {EMERGENCY_CONTACTS.slice(0, 3).map((c, i) => (
                    <span key={i} className="text-xs text-white/60 bg-white/5 px-3 py-1.5 rounded-full">{c.service}: <span className="text-white/90 font-semibold">{c.contact}</span></span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ ANALYTICS TAB ═══════════════════ */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex items-center py-24 px-10 z-20 pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl w-full h-full p-10 flex flex-col overflow-y-auto">
                
                <div className="mb-8">
                  <h2 className="text-4xl font-bold mb-2 flex items-center gap-3"><BarChart3 className="text-syn-blue w-10 h-10" /> Performance Telemetry</h2>
                  <p className="text-white/50 text-lg">Your vehicle compatibility & efficiency analysis for the Chennai → Pondicherry ECR trip.</p>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-syn-cyan/50 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-syn-cyan/10 rounded-full blur-[30px] group-hover:bg-syn-cyan/20 transition-colors" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Avg Efficiency</span>
                    <div className="text-4xl font-black mt-3">{efficiency} <span className="text-lg text-white/50 font-medium">Wh/km</span></div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[30px]" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Route Distance</span>
                    <div className="text-4xl font-black mt-3">150 <span className="text-lg text-white/50 font-medium">km</span></div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-green-500/50 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-[30px]" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Charging Cost (est.)</span>
                    <div className="text-4xl font-black text-green-400 mt-3">₹280–400</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-[30px]" />
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Toll Charges</span>
                    <div className="text-4xl font-black mt-3">{ROUTE_SUMMARY.tollCharges}</div>
                  </div>
                </div>

                {/* EV Model Compatibility Table */}
                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 flex-1">
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Battery size={20} className="text-syn-cyan" /> EV Model Compatibility – ECR 150 km</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 text-left">
                          <th className="pb-4 text-xs uppercase tracking-widest text-white/50 font-semibold">EV Model</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-white/50 font-semibold">Rated Range</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-white/50 font-semibold">Real-World Range</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-white/50 font-semibold">Battery</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-white/50 font-semibold">Feasibility</th>
                          <th className="pb-4 text-xs uppercase tracking-widest text-white/50 font-semibold">Charge Stop?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {EV_MODELS.map((ev, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 font-bold text-sm text-white/90">{ev.name}</td>
                            <td className="py-4 text-sm text-white/70">{ev.ratedRange} km</td>
                            <td className="py-4 text-sm text-white/70">{ev.realRange}</td>
                            <td className="py-4 text-sm text-white/70">{ev.battery}</td>
                            <td className="py-4"><span className={cn("text-xs font-bold px-2 py-1 rounded-full", ev.feasibility === "Excellent" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400")}>{ev.feasibility === "Excellent" ? "✅ " : "⚠️ "}{ev.feasibility}</span></td>
                            <td className="py-4 text-sm">{ev.needsStop ? <span className="text-yellow-400 font-medium">Recommended</span> : <span className="text-green-400 font-medium">Not Needed</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Efficiency Graph */}
                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">Weekly Efficiency Trend</h3>
                    <button className="px-4 py-2 border border-white/20 rounded-lg text-sm text-white/60 hover:text-white transition-colors">Last 7 Days</button>
                  </div>
                  <div className="flex items-end gap-2 md:gap-6 h-40 border-b border-white/10 pb-2">
                    {[30, 45, 80, 40, 95, 55, 90].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-syn-blue/20 to-syn-cyan/80 rounded-t-lg hover:opacity-80 transition-all relative group cursor-crosshair" style={{ height: `${h}%` }}>
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-90 group-hover:scale-100 shadow-xl origin-bottom">
                          {Math.round(h * 2)} Wh/km
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4 text-sm font-semibold text-white/40 px-4 md:px-8">
                    <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
