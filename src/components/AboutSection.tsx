import React from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Lightbulb,
  Target,
} from 'lucide-react';
import { MedGuardLogo } from './MedGuardLogo';
import { SectionHeader } from './SectionHeader';

const PROJECT_OBJECTIVES = [
  {
    title: 'Protect patient information',
    detail: 'Safeguard sensitive electronic health records using AES-256-GCM and RSA-2048 cryptography.',
  },
  {
    title: 'Demonstrate secure communication',
    detail: 'Visualize encrypted departmental traffic across segmented clinical and server VLANs.',
  },
  {
    title: 'Detect suspicious network activities',
    detail: 'Analyze packet flows in real time to flag unauthorized logins, port sweeps, and anomalies.',
  },
  {
    title: 'Improve network routing',
    detail: 'Compute optimal lowest-cost routes with Dijkstra SPF and dynamic OSPF area resilience.',
  },
  {
    title: 'Maintain data integrity',
    detail: 'Use SHA-256 cryptographic hashing to instantly catch any unauthorized record modification.',
  },
  {
    title: 'Control unauthorized access',
    detail: 'Enforce strict Role-Based Access Control (RBAC) across Doctors, Nurses, Admins, and Lab Techs.',
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="CNIP Final-Year Academic Project"
        title="About The Project"
        subtitle="Intelligent Secure Hospital Network Using Multiple Security Algorithms — Research Motivation, Architecture Solution & Core Objectives."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-rose-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-300">
                Research Challenge
              </span>
              <h3 className="font-display text-xl font-bold text-white">Problem Statement</h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            Hospital networks handle sensitive patient information. Unauthorized access, insecure
            communication, and data modification can threaten patient privacy and hospital
            operations.
          </p>

          <div className="mt-4 rounded-xl border border-slate-800 bg-[#050E1B] p-4 text-xs text-slate-400 leading-relaxed">
            Modern healthcare environments interconnect emergency bays, ICU monitors, diagnostic
            labs, and central EHR databases. Without layered defense, a single compromised terminal
            or unencrypted network link puts life-critical clinical workflows at risk.
          </div>
        </div>

        {/* Proposed Solution */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-cyan-300">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300">
                MEDGUARD AI Approach
              </span>
              <h3 className="font-display text-xl font-bold text-white">Proposed Solution</h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            A demonstration of a secure hospital network using encryption, hashing, routing,
            intrusion detection, and access control.
          </p>

          <div className="mt-4 rounded-xl border border-teal-500/25 bg-teal-500/10 p-4 text-xs text-teal-100/90 leading-relaxed">
            MEDGUARD AI unifies <strong>AES-256-GCM</strong> confidentiality,{' '}
            <strong>RSA-2048</strong> key exchange, <strong>SHA-256</strong> integrity checking,{' '}
            <strong>Dijkstra &amp; OSPF</strong> optimal routing, <strong>IDS</strong> threat
            monitoring, and <strong>RBAC</strong> least-privilege access inside an interactive SOC
            command platform.
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="mt-6 glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">
              Academic Outcomes
            </span>
            <h3 className="font-display text-xl font-bold text-white">Project Objectives</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROJECT_OBJECTIVES.map((obj, idx) => (
            <div
              key={obj.title}
              className="rounded-xl border border-slate-800 bg-[#061222]/90 p-4 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">0{idx + 1}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <h4 className="mt-2 font-display text-sm font-bold text-white">{obj.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{obj.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Presentation Footer */}
      <footer className="mt-10 rounded-2xl border border-cyan-500/20 bg-[#050D1A]/95 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <MedGuardLogo size={42} />
            <div>
              <div className="font-display text-base font-bold text-white">
                MEDGUARD AI — Intelligent Secure Hospital Network Using Multiple Security Algorithms
              </div>
              <p className="text-xs text-teal-300/90 mt-0.5">
                &ldquo;Protecting Patient Data. Securing Hospital Networks. Enabling Smarter Healthcare.&rdquo;
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3.5 py-2 text-xs font-medium text-cyan-200">
            <Award className="h-4 w-4 text-cyan-400" />
            <span>CNIP Academic Project Demonstration • Single-Page SOC</span>
          </div>
        </div>
      </footer>
    </section>
  );
};

