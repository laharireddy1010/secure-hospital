import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  GitBranch,
  KeyRound,
  Lock,
  Play,
  Route,
  ShieldAlert,
  UserCheck,
  X,
} from 'lucide-react';
import { SECURITY_ALGORITHMS } from '../data/hospitalData';
import type { AlgorithmInfo } from '../types/security';
import { runLiveRsaKeyExchange, type RsaKeyExchangeDemo } from '../utils/crypto';
import { SectionHeader } from './SectionHeader';

interface AlgorithmsSectionProps {
  onDemoAction: (algoId: AlgorithmInfo['id']) => void;
}

const ALGO_ICONS: Record<AlgorithmInfo['id'], React.ComponentType<{ className?: string }>> = {
  aes: Lock,
  rsa: KeyRound,
  sha256: Fingerprint,
  dijkstra: Route,
  ospf: GitBranch,
  ids: ShieldAlert,
  rbac: UserCheck,
};

const ACCENT_CLASSES: Record<string, string> = {
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  teal: 'border-teal-500/30 bg-teal-500/10 text-teal-300',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
};

export const AlgorithmsSection: React.FC<AlgorithmsSectionProps> = ({ onDemoAction }) => {
  const [rsaModalOpen, setRsaModalOpen] = useState(false);
  const [rsaRunning, setRsaRunning] = useState(false);
  const [rsaResult, setRsaResult] = useState<RsaKeyExchangeDemo | null>(null);
  const [rsaError, setRsaError] = useState<string | null>(null);

  const handleCardDemo = async (algoId: AlgorithmInfo['id']) => {
    if (algoId === 'rsa') {
      setRsaModalOpen(true);
      await triggerRsaDemo();
      return;
    }
    onDemoAction(algoId);
  };

  const triggerRsaDemo = async () => {
    setRsaRunning(true);
    setRsaError(null);
    try {
      const demo = await runLiveRsaKeyExchange();
      setRsaResult(demo);
    } catch (err) {
      setRsaError(err instanceof Error ? err.message : 'Web Crypto RSA-OAEP demo failed.');
    } finally {
      setRsaRunning(false);
    }
  };

  return (
    <section id="algorithms" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="Multi-Layered Defense Stack"
        title="Multiple Security Algorithms"
        subtitle="MEDGUARD AI coordinates seven complementary cryptographic, routing, intrusion detection, and access-control technologies to defend hospital networks end-to-end."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {SECURITY_ALGORITHMS.map((algo) => {
          const Icon = ALGO_ICONS[algo.id];
          const accentBadge = ACCENT_CLASSES[algo.accent] || ACCENT_CLASSES.cyan;

          return (
            <div
              key={algo.id}
              className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className={`rounded-xl border p-2.5 ${accentBadge}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                    {algo.category}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-white">{algo.name}</h3>
                <p className="text-xs font-medium text-cyan-300/90">{algo.fullName}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-200">{algo.shortSummary}</p>

                <div className="mt-4 space-y-2.5 border-t border-slate-800/80 pt-3.5 text-xs">
                  <div>
                    <span className="font-semibold text-teal-300">Purpose in Hospital Networks: </span>
                    <span className="text-slate-300 leading-relaxed">{algo.hospitalPurpose}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sky-300">How It Works: </span>
                    <span className="text-slate-400 leading-relaxed">{algo.howItWorks}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCardDemo(algo.id)}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-200 transition-all hover:border-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 text-cyan-400" />
                {algo.demoLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Web Crypto RSA-2048 Key Exchange Modal */}
      {rsaModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Live RSA-2048 Key Exchange Demonstration"
        >
          <div className="glass-card w-full max-w-2xl rounded-2xl border border-cyan-400/35 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
                  Live Browser Web Crypto API (RSA-OAEP 2048-bit)
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-white">
                  RSA Public-Key &amp; Session Key Exchange Demo
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Demonstrates how Emergency Dept safely sends a fresh 256-bit AES session key to
                  the Patient Records Server using the server&apos;s RSA Public Key.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRsaModalOpen(false)}
                className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Close RSA Demo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {rsaError && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                {rsaError}
              </div>
            )}

            {rsaRunning ? (
              <div className="mt-6 rounded-xl border border-cyan-500/20 bg-[#071425] p-6 text-center text-sm text-cyan-200">
                Generating 2048-bit RSA-OAEP keypair &amp; wrapping 256-bit AES session key...
              </div>
            ) : (
              rsaResult && (
                <div className="mt-5 space-y-3 text-xs">
                  <div className="rounded-xl border border-slate-800 bg-[#071425] p-3">
                    <div className="font-semibold text-sky-300">
                      1. Server Public Key (SPKI Base64 Preview — Shared Openly)
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-slate-300 break-all">
                      {rsaResult.publicKeyPemPreview}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#071425] p-3">
                    <div className="font-semibold text-cyan-300">
                      2. Generated 256-bit AES Session Key (Sender Side)
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-emerald-300 break-all">
                      {rsaResult.originalSessionKeyHex}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#071425] p-3">
                    <div className="font-semibold text-amber-300">
                      3. RSA-OAEP Encrypted Session Key (Safe to Send Over Network)
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-slate-300 break-all max-h-20 overflow-y-auto">
                      {rsaResult.encryptedSessionKeyBase64}
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-300">
                        4. Recovered Session Key Using Server Private Key
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {rsaResult.matched ? 'EXACT KEY MATCH' : 'MISMATCH'}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-emerald-200 break-all">
                      {rsaResult.recoveredSessionKeyHex}
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={triggerRsaDemo}
                disabled={rsaRunning}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 cursor-pointer"
              >
                Regenerate RSA-2048 Key Exchange
              </button>
              <button
                type="button"
                onClick={() => setRsaModalOpen(false)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

