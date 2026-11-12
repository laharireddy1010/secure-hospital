import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Fingerprint,
  Key,
  Lock,
  RefreshCw,
  ShieldCheck,
  Unlock,
} from 'lucide-react';
import {
  computeSha256,
  decryptAesGcm,
  encryptAesGcm,
  generateAesGcmKey,
} from '../utils/crypto';
import { SectionHeader } from './SectionHeader';

const SAMPLE_PATIENT_RECORDS = [
  {
    label: 'ICU Vitals (Fictional)',
    text: 'FICTIONAL PATIENT #PT-4092 | Name: Aarav Sharma (Demo) | Ward: ICU-Bed-04 | BP: 118/76 mmHg | SpO2: 98% | Status: Stable under observation.',
  },
  {
    label: 'Lab Pathology (Fictional)',
    text: 'FICTIONAL LAB #LB-8814 | Patient: Priya Nair (Demo) | Hemoglobin: 13.8 g/dL | Blood Glucose: 94 mg/dL | Verified by Lab Tech.',
  },
  {
    label: 'Pharmacy Rx (Fictional)',
    text: 'FICTIONAL RX #RX-2109 | Patient: Rohan Mehta (Demo) | Medication: Amoxicillin 500mg | Dosage: 1 tab every 8 hrs for 5 days.',
  },
];

export const EncryptionLabSection: React.FC = () => {
  const [patientInput, setPatientInput] = useState<string>(SAMPLE_PATIENT_RECORDS[0].text);
  const [aesKey, setAesKey] = useState<CryptoKey | null>(null);
  const [aesKeyHex, setAesKeyHex] = useState<string>('');
  const [ivBase64, setIvBase64] = useState<string>('');
  const [ivHex, setIvHex] = useState<string>('');
  const [encryptedOutput, setEncryptedOutput] = useState<string>('');
  const [decryptedOutput, setDecryptedOutput] = useState<string>('');

  // SHA-256 & Tamper Comparison State
  const [originalHash, setOriginalHash] = useState<string>('');
  const [tamperInput, setTamperInput] = useState<string>(SAMPLE_PATIENT_RECORDS[0].text);
  const [tamperHash, setTamperHash] = useState<string>('');
  const [statusNotice, setStatusNotice] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Initialize key & initial hash on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { key, rawHex } = await generateAesGcmKey();
        const initialDigest = await computeSha256(SAMPLE_PATIENT_RECORDS[0].text);
        if (mounted) {
          setAesKey(key);
          setAesKeyHex(rawHex);
          setOriginalHash(initialDigest);
          setTamperHash(initialDigest);
        }
      } catch {
        if (mounted) {
          setErrorMsg('Browser Web Crypto API is unavailable in this context.');
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Recompute tamper comparison hash live whenever tamperInput changes
  useEffect(() => {
    let active = true;
    computeSha256(tamperInput).then((digest) => {
      if (active) setTamperHash(digest);
    });
    return () => {
      active = false;
    };
  }, [tamperInput]);

  const handleSelectPreset = (text: string) => {
    setPatientInput(text);
    setTamperInput(text);
    setEncryptedOutput('');
    setDecryptedOutput('');
    setIvBase64('');
    setIvHex('');
    setErrorMsg('');
    computeSha256(text).then((hash) => setOriginalHash(hash));
    setStatusNotice('Loaded fictional sample patient record.');
  };

  const handleRotateKey = async () => {
    const { key, rawHex } = await generateAesGcmKey();
    setAesKey(key);
    setAesKeyHex(rawHex);
    setEncryptedOutput('');
    setDecryptedOutput('');
    setIvBase64('');
    setIvHex('');
    setStatusNotice('Generated fresh 256-bit AES-GCM CryptoKey via Web Crypto API.');
  };

  const handleEncrypt = async () => {
    setErrorMsg('');
    if (!patientInput.trim()) {
      setErrorMsg('Please enter sample fictional patient text to encrypt.');
      return;
    }
    try {
      let activeKey = aesKey;
      if (!activeKey) {
        const generated = await generateAesGcmKey();
        activeKey = generated.key;
        setAesKey(generated.key);
        setAesKeyHex(generated.rawHex);
      }
      const res = await encryptAesGcm(patientInput, activeKey);
      setEncryptedOutput(res.ciphertextBase64);
      setIvBase64(res.ivBase64);
      setIvHex(res.ivHex);
      setDecryptedOutput('');
      const hash = await computeSha256(patientInput);
      setOriginalHash(hash);
      setTamperInput(patientInput);
      setStatusNotice('Encrypted with genuine browser Web Crypto AES-256-GCM + random 96-bit IV.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Encryption failed.');
    }
  };

  const handleDecrypt = async () => {
    setErrorMsg('');
    if (!encryptedOutput || !ivBase64 || !aesKey) {
      setErrorMsg('Click Encrypt first to generate ciphertext and IV for decryption.');
      return;
    }
    try {
      const plain = await decryptAesGcm(encryptedOutput, ivBase64, aesKey);
      setDecryptedOutput(plain);
      setStatusNotice('Successfully decrypted ciphertext back to exact original patient record.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Decryption failed.');
    }
  };

  const handleGenerateHash = async () => {
    setErrorMsg('');
    const hash = await computeSha256(patientInput);
    setOriginalHash(hash);
    setTamperInput(patientInput);
    setStatusNotice('Generated genuine SHA-256 64-character hex digest.');
  };

  const handleSimulateOneCharTamper = () => {
    if (!tamperInput) return;
    const tampered = tamperInput.includes('98%')
      ? tamperInput.replace('98%', '89%')
      : tamperInput + ' ';
    setTamperInput(tampered);
    setStatusNotice('Modified a tiny detail in the received copy — observe the SHA-256 avalanche effect!');
  };

  const hashesMatch = Boolean(originalHash && tamperHash && originalHash === tamperHash);

  return (
    <section id="encryption-lab" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="Real Browser Web Crypto API"
        title="Encryption Laboratory"
        subtitle="Test genuine client-side AES-256-GCM authenticated encryption and SHA-256 integrity hashing. Enter fictional patient data only."
        simBadge="Fictional Patient Data Only • Real Web Crypto"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: AES-256-GCM Interactive Panel */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-cyan-300">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    AES-256-GCM Patient Data Cipher
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    window.crypto.subtle • 256-bit Key + 96-bit Random IV
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRotateKey}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 hover:border-cyan-400/50 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                New 256-bit Key
              </button>
            </div>

            {/* Preset fictional sample buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              {SAMPLE_PATIENT_RECORDS.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => handleSelectPreset(sample.text)}
                  className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 text-[11px] font-medium text-cyan-200 hover:bg-cyan-500/15 cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sample Fictional Patient Information
            </label>
            <textarea
              rows={3}
              value={patientInput}
              onChange={(e) => setPatientInput(e.target.value)}
              placeholder="Enter fictional patient details for educational encryption demo..."
              className="w-full rounded-xl border border-slate-700/80 bg-[#050E1B] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />

            {/* Active 256-bit Key Display */}
            <div className="mt-3 rounded-xl border border-slate-800 bg-[#050E1B] p-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 text-cyan-300 font-medium">
                  <Key className="h-3 w-3" />
                  Active AES-256 Key (Hex)
                </span>
                {ivHex && <span className="font-mono text-teal-300">IV: {ivHex}</span>}
              </div>
              <div className="mt-1 font-mono text-[11px] text-slate-300 break-all">
                {aesKeyHex || 'Initializing Web Crypto key...'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleEncrypt}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                Encrypt
              </button>

              <button
                type="button"
                onClick={handleDecrypt}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/25 cursor-pointer"
              >
                <Unlock className="h-3.5 w-3.5" />
                Decrypt
              </button>

              <button
                type="button"
                onClick={handleGenerateHash}
                className="inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/15 px-4 py-2.5 text-xs font-semibold text-teal-200 hover:bg-teal-500/25 cursor-pointer"
              >
                <Fingerprint className="h-3.5 w-3.5" />
                Generate SHA-256 Hash
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {errorMsg}
              </div>
            )}
            {statusNotice && !errorMsg && (
              <div className="mt-3 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200">
                {statusNotice}
              </div>
            )}
          </div>

          {/* Encrypted & Decrypted Outputs */}
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-800 bg-[#050E1B] p-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                Encrypted Output (AES-256-GCM Ciphertext Base64)
              </div>
              <div className="mt-1.5 font-mono text-xs text-amber-100/90 break-all max-h-24 overflow-y-auto">
                {encryptedOutput || 'Click "Encrypt" to transform patient data into unreadable ciphertext.'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#050E1B] p-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                Decrypted Output (Recovered Plaintext)
              </div>
              <div className="mt-1.5 font-mono text-xs text-emerald-200 break-words">
                {decryptedOutput || 'Click "Decrypt" after encrypting to verify lossless recovery.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: SHA-256 Integrity & Tamper Detection Demonstration */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-2 text-teal-300">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    SHA-256 Integrity &amp; Tamper Detection
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Demonstrates how modifying even 1 character alters the entire cryptographic hash
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#050E1B] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                  Original Record SHA-256 Digest (256-bit Hex)
                </span>
                <span className="font-mono text-[10px] text-slate-500">64 HEX CHARS</span>
              </div>
              <div className="mt-1.5 font-mono text-xs text-cyan-200 break-all">
                {originalHash || 'Calculating...'}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Received / Editable Copy (Try Editing Any Character)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateOneCharTamper}
                    className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                  >
                    Tamper 1 Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => setTamperInput(patientInput)}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white cursor-pointer"
                  >
                    Restore Exact Copy
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                value={tamperInput}
                onChange={(e) => setTamperInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-[#050E1B] px-3.5 py-2.5 text-sm text-slate-100 focus:border-teal-400 focus:outline-none"
              />
            </div>

            <div className="mt-3 rounded-xl border border-slate-800 bg-[#050E1B] p-3.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                Recomputed SHA-256 Digest of Received Copy
              </div>
              <div
                className={`mt-1.5 font-mono text-xs break-all ${
                  hashesMatch ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {tamperHash}
              </div>
            </div>
          </div>

          {/* Integrity Verdict Banner */}
          <div
            className={`mt-5 rounded-xl border p-4 transition-all ${
              hashesMatch
                ? 'border-emerald-500/35 bg-emerald-500/10'
                : 'border-rose-500/40 bg-rose-500/15'
            }`}
          >
            <div className="flex items-start gap-3">
              {hashesMatch ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div
                  className={`text-sm font-bold ${
                    hashesMatch ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {hashesMatch
                    ? 'INTEGRITY VERIFIED — Hashes Match Exactly'
                    : 'TAMPERING DETECTED — SHA-256 Hash Mismatch!'}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {hashesMatch
                    ? 'The received patient record matches the original SHA-256 fingerprint bit-for-bit. No unauthorized alteration occurred in transit.'
                    : 'Even a tiny 1-character change produced a completely different SHA-256 hash (avalanche effect). MEDGUARD AI immediately rejects tampered medical records.'}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 border-t border-white/10 pt-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>
                Educational Demo: Real SHA-256 computed via browser Web Crypto API on fictional inputs.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

