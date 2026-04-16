"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, ArrowRight, Zap, ShieldAlert, Fingerprint } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsAuthenticating(true);
    setError(false);

    // Premium authentication delay
    setTimeout(() => {
      if (username === "syndriveadmin" && password === "syn5515521c") {
        setAuthSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500); // Allow success animation to play before redirecting
      } else {
        setError(true);
        setIsAuthenticating(false);
        setPassword("");
      }
    }, 1800);
  };

  return (
    <div className="bg-[#030303] min-h-screen text-white font-sans flex items-center justify-center relative overflow-hidden selection:bg-syn-cyan/30">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-syn-blue/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-syn-blue to-transparent opacity-50" />

          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="SynDrive Logo" className="h-32 w-auto -my-8 object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] scale-[1.3]" />
          </div>

          <AnimatePresence mode="wait">
            {!authSuccess ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white/90">Identity Verification</h2>
                  <p className="text-white/40 text-sm mt-1">Authenticate to access the vehicle core.</p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <User size={18} className={error ? "text-red-400" : "text-white/40 group-focus-within:text-syn-cyan transition-colors"} />
                    </div>
                    <input
                      type="text"
                      placeholder="Operator ID"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isAuthenticating}
                      className={`w-full bg-black/40 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-syn-cyan/50'} rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none text-white placeholder-white/30 transition-all disabled:opacity-50`}
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Lock size={18} className={error ? "text-red-400" : "text-white/40 group-focus-within:text-syn-cyan transition-colors"} />
                    </div>
                    <input
                      type="password"
                      placeholder="Access Token"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isAuthenticating}
                      className={`w-full bg-black/40 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-syn-cyan/50'} rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none text-white placeholder-white/30 transition-all disabled:opacity-50`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                    >
                      <ShieldAlert size={14} />
                      Authentication failed. Unauthorized access attempt logged.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAuthenticating || !username || !password}
                    className="group relative flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-sm tracking-wide"
                  >
                    {isAuthenticating ? (
                      <div className="flex items-center gap-2 tracking-widest text-black/50">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        VERIFYING
                      </div>
                    ) : (
                      <>
                        INITIALIZE SYSTEM
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}

                    {/* Button Glint Effect */}
                    {!isAuthenticating && (
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[glint_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 opacity-50" />
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-syn-cyan/20 rounded-full flex items-center justify-center border border-syn-cyan/50 relative z-10 shadow-[0_0_40px_rgba(0,214,255,0.4)]">
                    <Fingerprint size={32} className="text-syn-cyan" />
                  </div>
                  {/* Expanding ring */}
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 border-2 border-syn-cyan rounded-full z-0"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white/90 tracking-wide mb-2">Access Granted</h3>
                  <p className="text-sm text-syn-cyan animate-pulse tracking-widest uppercase">Connecting to SynOS...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/30 uppercase tracking-widest">Team Code Crew</p>
        </div>
      </motion.div>

    </div>
  );
}
