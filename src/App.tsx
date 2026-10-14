import React, { useState } from 'react';
import {
  Activity,
  Code,
  Cpu,
  Database,
  Eye,
  Globe,
  Layers,
  Radio,
  Server,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CopilotHUD } from './components/CopilotHUD';
import { ArchitectureView } from './components/ArchitectureView';
import { DatabaseView } from './components/DatabaseView';
import { PythonCodeView } from './components/PythonCodeView';
import { LocalizationMatrixView } from './components/LocalizationMatrixView';
import { FlutterMobileView } from './components/FlutterMobileView';
import { Smartphone } from 'lucide-react';

type NavigationTab = 'hud' | 'flutter' | 'architecture' | 'database' | 'python' | 'localization';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('hud');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Futuristic Header */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & System Status */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 flex items-center justify-center border border-cyan-400/50 shadow-md shadow-cyan-500/30">
                <Radio className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-mono font-bold text-base sm:text-lg tracking-wider text-white">
                    AI REAL-TIME <span className="text-cyan-400">LIFE COPILOT</span>
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    v2.4 NEURAL OS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                  24/7 Continuous Multimodal Ambient Companion • Health, Finance & Social Memory
                </p>
              </div>
            </div>

            {/* Hardware & Latency Badges */}
            <div className="hidden lg:flex items-center space-x-3 text-xs font-mono">
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>TWS BLE AUDIO: READY</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>LATENCY: &lt;180MS</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>5 NATIVE LANGUAGES</span>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-900">
            <button
              onClick={() => setActiveTab('hud')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'hud'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Copilot Live HUD</span>
            </button>

            <button
              onClick={() => setActiveTab('flutter')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'flutter'
                  ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Flutter Mobile Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>System Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'database'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>pgvector Database Schema</span>
            </button>

            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'python'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>FastAPI Operational Code</span>
            </button>

            <button
              onClick={() => setActiveTab('localization')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTab === 'localization'
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>5-Language Matrix</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'hud' && <CopilotHUD />}
        {activeTab === 'flutter' && <FlutterMobileView />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'database' && <DatabaseView />}
        {activeTab === 'python' && <PythonCodeView />}
        {activeTab === 'localization' && <LocalizationMatrixView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            AI Real-Time Life Copilot • Next-Gen Multimodal Architecture & Ambient Operational Blueprint
          </div>
          <div className="text-slate-400 flex items-center space-x-4">
            <span>FastAPI Pipeline</span>
            <span>•</span>
            <span>PostgreSQL 16 + pgvector</span>
            <span>•</span>
            <span>LC3 Bluetooth Audio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
