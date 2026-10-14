import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Layers,
  Network,
  Radio,
  Server,
  Smartphone,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { LATENCY_BUDGET, TOTAL_LATENCY_BUDGET_MS, CURRENT_TOTAL_AVG_MS, ARCHITECTURE_TIERS } from '../data/architectureBlueprint';

export function ArchitectureView() {
  const [selectedTier, setSelectedTier] = useState<number>(0);

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
              <Layers className="w-4 h-4" />
              <span>Full-Stack Architecture Specification</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              End-to-End Multimodal Edge & Cloud Architecture
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Engineered for sub-180ms glass-to-ear latency. Integrates continuous ambient audio via TWS earbuds, optical frames via smart glasses or mobile dock, and autonomic biometrics synced to PostgreSQL with pgvector.
            </p>
          </div>
          <div className="text-right p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono">
            <div className="text-xs text-slate-400">TOTAL GLASS-TO-EAR LATENCY</div>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">
              {CURRENT_TOTAL_AVG_MS} ms <span className="text-xs text-slate-400 font-normal">/ {TOTAL_LATENCY_BUDGET_MS}ms target</span>
            </div>
            <div className="text-[10px] text-emerald-300 font-medium">✓ REAL-TIME AUDIO COMPLIANT</div>
          </div>
        </div>
      </div>

      {/* Interactive Pipeline Flowchart */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
          <Network className="w-4 h-4" />
          <span>Continuous Real-Time Data Pipeline Flow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="font-bold">STAGE 01</span>
                <span>22 ms</span>
              </div>
              <div className="font-bold text-white text-sm mb-1">Edge Perception</div>
              <p className="text-xs text-slate-400">
                Camera (1080p@30fps), TWS dual ambient mic array, and PPG heart rate telemetry.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              CameraX / BLE Audio LC3
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="font-bold">STAGE 02</span>
                <span>12 ms</span>
              </div>
              <div className="font-bold text-white text-sm mb-1">WebRTC Gateway</div>
              <p className="text-xs text-slate-400">
                Binary multiplexing over QUIC / WebSockets with frame downscaling & VAD filtering.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              FastAPI / uvloop / Protobuf
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="font-bold">STAGE 03</span>
                <span>44 ms</span>
              </div>
              <div className="font-bold text-white text-sm mb-1">Multimodal Core</div>
              <p className="text-xs text-slate-400">
                Parallel inference: YOLOv11 (Food), OCR (Price tag), and ArcFace 512-D face mesh.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              ONNX / TensorRT / Triton
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="font-bold">STAGE 04</span>
                <span>11 ms</span>
              </div>
              <div className="font-bold text-white text-sm mb-1">pgvector HNSW</div>
              <p className="text-xs text-slate-400">
                Cosine similarity lookup for social memory + user daily budget limit validation.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              PostgreSQL 16 + pgvector
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="font-bold">STAGE 05</span>
                <span>68 ms</span>
              </div>
              <div className="font-bold text-white text-sm mb-1">Language & Audio</div>
              <p className="text-xs text-slate-400">
                Language detection switcher (5 languages) + Neural TTS stream to TWS earbud.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              Gemini TTS / BLE LC3 Audio
            </div>
          </div>
        </div>
      </div>

      {/* Latency Budget Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Rigorous Glass-to-Ear Latency Budget</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Human conversational threshold: &lt;200ms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-3">Processing Phase</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Target (Max)</th>
                <th className="p-3">Actual Average</th>
                <th className="p-3">Core Technology Stack</th>
                <th className="p-3">Performance Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {LATENCY_BUDGET.map((phase, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-semibold text-white">{phase.phase}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                      {phase.tier}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{phase.targetMs} ms</td>
                  <td className="p-3 font-bold text-emerald-400">{phase.actualAvgMs} ms</td>
                  <td className="p-3 text-cyan-200">{phase.technologies}</td>
                  <td className="p-3 text-slate-400 font-sans text-xs">{phase.description}</td>
                </tr>
              ))}
              <tr className="bg-slate-950/80 font-bold border-t-2 border-cyan-500/30">
                <td className="p-3 text-cyan-300">TOTAL END-TO-END ROUNDTRIP</td>
                <td className="p-3 text-slate-400">Full System</td>
                <td className="p-3 text-amber-400">&lt; 180 ms</td>
                <td className="p-3 text-emerald-400 text-sm">{CURRENT_TOTAL_AVG_MS} ms</td>
                <td className="p-3 text-cyan-300">Unified Architecture</td>
                <td className="p-3 text-emerald-400 font-sans">
                  Optimal real-time audio intervention speed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Tier Architectural Layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ARCHITECTURE_TIERS.map((tier, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {tier.badge}
                </span>
                <span className="text-xs font-mono text-slate-500">Tier 0{idx + 1}</span>
              </div>
              <h4 className="font-bold text-white text-base mb-3">{tier.title}</h4>
              <div className="space-y-3">
                {tier.components.map((comp, cIdx) => (
                  <div key={cIdx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <div className="font-mono text-xs font-bold text-cyan-300 mb-1">{comp.name}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{comp.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edge vs Cloud Processing Tradeoff Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Edge vs Cloud Processing Partitioning</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold">
              <Smartphone className="w-4 h-4" />
              <span>ON-DEVICE EDGE TIER (Phone & Earbuds)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li><strong>Continuous Voice Activity Detection (VAD):</strong> Silero VAD runs at 16kHz on NPU to detect speech intent without streaming continuous silent audio.</li>
              <li><strong>Adaptive Optical Frame Sampler:</strong> Downsamples camera stream from 30 FPS to 1-2 FPS keyframes based on accelerometer motion triggers and retail/dining scene changes.</li>
              <li><strong>Local BLE Mesh Protocol:</strong> Handles Bluetooth Low Energy (LC3 audio) low-latency link directly to TWS smart earbuds.</li>
              <li><strong>Offline Fallback Cache:</strong> Pre-caches top 50 social contacts and emergency allergy rules locally in SQLite with vector extensions for zero-connectivity situations.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold">
              <Server className="w-4 h-4" />
              <span>DISTRIBUTED CLUSTER TIER (FastAPI & pgvector)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
              <li><strong>Heavyweight Multimodal Vision:</strong> Gemini 3.8 Flash & YOLOv11 for high-precision food calorie estimation and OCR parsing.</li>
              <li><strong>PostgreSQL 16 + pgvector HNSW:</strong> Scalable vector search across hundreds of thousands of interaction memories with &lt;15ms query execution.</li>
              <li><strong>Neural Speech Synthesis:</strong> High-fidelity low-latency TTS models delivering natural inflection in Tamil, Hindi, Spanish, German, and English.</li>
              <li><strong>Cross-Platform State Sync:</strong> Coordinates historical daily budgets, health logs, and financial transaction alerts across mobile, tablet, and wearable devices.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
