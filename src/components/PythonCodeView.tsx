import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  Terminal,
  Server,
  Zap,
  Cpu,
  FileCode,
} from 'lucide-react';
import { FASTAPI_PRODUCTION_CODE } from '../data/fastapiCode';

export function PythonCodeView() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(FASTAPI_PRODUCTION_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([FASTAPI_PRODUCTION_CODE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copilot_engine.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold uppercase">
            <Server className="w-4 h-4" />
            <span>Python AI Pipeline Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Production FastAPI Streaming Architecture
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Asynchronous multi-modal WebSocket server processing high-speed camera frames, ambient audio VAD, native 5-language routing, and asyncpg pgvector queries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied Python Code!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center space-x-1.5 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download copilot_engine.py</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-cyan-400 font-bold mb-1">01. Zero-Copy WebSocket</div>
          <p className="text-xs text-slate-400">
            Binary and JSON multiplexing at <code>/ws/copilot-stream/{`{user_id}`}</code> with Pydantic v2 schemas.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-emerald-400 font-bold mb-1">02. Language Engine Layer</div>
          <p className="text-xs text-slate-400">
            Automated language switcher for Tamil, Hindi, Spanish, German, and English using script ranges and token heuristics.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-amber-400 font-bold mb-1">03. Wearable Correlator</div>
          <p className="text-xs text-slate-400">
            Correlates simple sugar & glycemic index with live heart rate (BPM) & sleep score recovery.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-mono text-purple-400 font-bold mb-1">04. Async pgvector Query</div>
          <p className="text-xs text-slate-400">
            Sub-15ms ArcFace 512-D vector cosine search using <code>asyncpg</code> connection pooling.
          </p>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>copilot_engine.py</span>
            <span className="text-slate-500">• 310 lines • Python 3.11+</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            FastAPI + asyncpg + pgvector + PyTorch / ONNX
          </div>
        </div>

        <pre className="text-xs font-mono text-emerald-300/90 overflow-x-auto p-4 bg-slate-900/60 rounded-xl max-h-[640px] leading-relaxed select-all">
          {FASTAPI_PRODUCTION_CODE}
        </pre>
      </div>

      {/* Deployment & Execution snippet */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
          <Terminal className="w-4 h-4" />
          <span>Quickstart Execution Instructions</span>
        </h4>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
          <div className="text-slate-500"># 1. Install production dependencies</div>
          <div className="text-cyan-300 font-bold">
            pip install fastapi uvicorn[standard] asyncpg opencv-python-headless numpy pydantic
          </div>
          <div className="text-slate-500 mt-2"># 2. Set database connection string</div>
          <div className="text-cyan-300 font-bold">
            export DATABASE_URL="postgresql://copilot:password@localhost:5432/copilot_db"
          </div>
          <div className="text-slate-500 mt-2"># 3. Launch the high-concurrency event loop</div>
          <div className="text-emerald-400 font-bold">
            uvicorn copilot_engine:app --host 0.0.0.0 --port 8000 --workers 4 --loop uvloop
          </div>
        </div>
      </div>
    </div>
  );
}
