import React, { useState } from 'react';
import {
  Smartphone,
  Copy,
  Check,
  Download,
  Play,
  Volume2,
  Zap,
  Radio,
  FileCode,
  Send,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';
import { FLUTTER_MAIN_DART, FLUTTER_PUBSPEC_YAML } from '../data/flutterCode';
import { audioCopilot } from '../utils/audioSynthesizer';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../data/localizationData';

export function FlutterMobileView() {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('ta');
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'api'>('simulator');
  const [codeFileTab, setCodeFileTab] = useState<'main' | 'pubspec'>('main');
  const [copied, setCopied] = useState<boolean>(false);

  // Mobile simulator state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hapticTriggered, setHapticTriggered] = useState<boolean>(false);
  const [latestResponse, setLatestResponse] = useState<any>({
    status: 'success',
    action: 'TRIGGER_AUDIO_ALERT',
    payload: {
      text_message: 'எச்சரிக்கை! இதில் சர்க்கரை அளவு அதிகம். உங்கள் இதய துடிப்புக்கு இது நல்லதல்ல.',
      haptic_feedback: true,
      detected_object: 'High Sugar Carbonated Beverage Product Item',
      selected_language: 'ta',
      latency_ms: 138,
    },
  });

  // API Tester Form
  const [testUserId, setTestUserId] = useState<string>('user-flutter-882');
  const [testLat, setTestLat] = useState<number>(37.7749);
  const [testLng, setTestLng] = useState<number>(-122.4194);
  const [apiResponseJson, setApiResponseJson] = useState<string>('');

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Call /api/v1/process-stream endpoint
  const executeStreamCall = async (langCode: LanguageCode) => {
    setIsProcessing(true);
    const start = performance.now();

    try {
      const res = await fetch('/api/v1/process-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: testUserId,
          current_lat: testLat,
          current_lng: testLng,
          detected_language: langCode,
          scenario: 'sugar_beverage',
        }),
      });

      const json = await res.json();
      const elapsed = Math.round(performance.now() - start);
      json.payload.latency_ms = elapsed;

      setLatestResponse(json);
      setApiResponseJson(JSON.stringify(json, null, 2));

      // Trigger Haptic Feedback
      if (json.payload.haptic_feedback) {
        setHapticTriggered(true);
        if ('vibrate' in navigator) {
          navigator.vibrate([80, 40, 80]);
        }
        setTimeout(() => setHapticTriggered(false), 1200);
      }

      // Audio Alert Dispatch
      audioCopilot.playTone('alarm_high');
      setTimeout(() => {
        audioCopilot.speakAlert(json.payload.text_message, langCode);
      }, 250);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs font-semibold uppercase">
            <Smartphone className="w-4 h-4" />
            <span>Cross-Platform Flutter Client Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Flutter Multi-Modal Camera Ingestion & API Pipeline
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Live interactive client running the Flutter camera stream, streaming frames to <code>/api/v1/process-stream</code>, triggering native haptics and multilingual earbud TTS.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            📱 Mobile Emulator
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            💻 Flutter Code (.dart)
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'api'
                ? 'bg-blue-500 text-slate-950 font-bold shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            ⚡ API Tester Console
          </button>
        </div>
      </div>

      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mobile Device Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className={`relative w-[340px] h-[680px] rounded-[48px] bg-slate-950 p-3 shadow-2xl border-4 transition-all duration-300 ${
              hapticTriggered 
                ? 'border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4)] scale-[1.01]' 
                : 'border-slate-800 shadow-cyan-950/30'
            }`}>
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>

              {/* Inner Screen Container */}
              <div className="w-full h-full rounded-[38px] overflow-hidden bg-slate-950 relative flex flex-col justify-between select-none">
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40 flex items-center justify-center">
                  <div className="relative flex flex-col items-center">
                    <div className="w-44 h-44 rounded-full border-2 border-dashed border-cyan-400/50 flex items-center justify-center relative">
                      <div className="w-32 h-32 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <span className="text-5xl">🥤</span>
                      </div>
                      {/* Targeting Reticle corner accents */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                    </div>
                    <div className="mt-3 text-[10px] font-mono text-cyan-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded">
                      OBJECT: CARBONATED BEVERAGE
                    </div>
                  </div>
                </div>

                {/* Top App Bar inside Flutter Screen */}
                <div className="relative z-20 pt-10 px-4 pb-2 bg-slate-950/60 backdrop-blur-md flex items-center justify-between border-b border-white/10">
                  <div className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>AI Life Copilot Live Matrix</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    24/7 ACTIVE
                  </span>
                </div>

                {/* Multilingual Selector inside Flutter Screen */}
                <div className="relative z-20 px-3 py-2 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.code);
                        executeStreamCall(lang.code);
                      }}
                      className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                        selectedLang === lang.code
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-900/80 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {lang.flag} {lang.nativeName}
                    </button>
                  ))}
                </div>

                {/* User's Exact Stack Bottom Overlay Widget */}
                <div className="relative z-20 p-4 space-y-2">
                  <div className="p-4 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-500/40 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        STREAM TELEMETRY • {latestResponse?.payload?.latency_ms || 142}ms
                      </span>
                      {hapticTriggered && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          📳 HAPTIC PULSE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white leading-relaxed font-sans">
                      {latestResponse?.payload?.text_message || (
                        'AI Active: Analyzing Multi-modal streams...\nLanguages: EN, TA, HI, ES, DE'
                      )}
                    </div>
                  </div>

                  {/* Simulator Trigger Button */}
                  <button
                    onClick={() => executeStreamCall(selectedLang)}
                    disabled={isProcessing}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{isProcessing ? 'Processing Stream Frame...' : 'Send Stream Frame'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Information & Explanation Panel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Flutter Client Operational Mechanism</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Flutter client establishes a continuous multi-modal pipeline with the central engine. Rather than overwhelming network bandwidth with 30 FPS raw video, it employs an <strong>adaptive optical frame sampler</strong> that triggers when significant scene motion or commercial/dining beacons are detected.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Target API Endpoint:</span>
                  <span className="text-cyan-300 font-bold">POST /api/v1/process-stream</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Haptic Engine:</span>
                  <span className="text-emerald-400 font-bold">HapticFeedback.heavyImpact()</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Audio Speech Engine:</span>
                  <span className="text-purple-400 font-bold">flutter_tts (5 Languages)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Current Language:</span>
                  <span className="text-white font-bold">{selectedLang.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Live Response Payload Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Live Dispatch Payload from Server
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  HTTP 200 OK
                </span>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(latestResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setCodeFileTab('main')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  codeFileTab === 'main'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                    : 'text-slate-400 hover:text-white bg-slate-800'
                }`}
              >
                lib/main.dart (Flutter UI & Logic)
              </button>
              <button
                onClick={() => setCodeFileTab('pubspec')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  codeFileTab === 'pubspec'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                    : 'text-slate-400 hover:text-white bg-slate-800'
                }`}
              >
                pubspec.yaml (Dependencies)
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopyCode(codeFileTab === 'main' ? FLUTTER_MAIN_DART : FLUTTER_PUBSPEC_YAML)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={() => handleDownload(codeFileTab === 'main' ? 'main.dart' : 'pubspec.yaml', codeFileTab === 'main' ? FLUTTER_MAIN_DART : FLUTTER_PUBSPEC_YAML)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 flex items-center space-x-1 shadow-md shadow-blue-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl">
            <pre className="text-xs font-mono text-blue-200/90 overflow-x-auto p-3 bg-slate-900/60 rounded-xl max-h-[600px] leading-relaxed select-all">
              {codeFileTab === 'main' ? FLUTTER_MAIN_DART : FLUTTER_PUBSPEC_YAML}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>POST /api/v1/process-stream Request Builder</span>
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">user_id:</label>
                <input
                  type="text"
                  value={testUserId}
                  onChange={(e) => setTestUserId(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">current_lat:</label>
                  <input
                    type="number"
                    value={testLat}
                    onChange={(e) => setTestLat(parseFloat(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">current_lng:</label>
                  <input
                    type="number"
                    value={testLng}
                    onChange={(e) => setTestLng(parseFloat(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">detected_language (en, ta, hi, es, de):</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.code} - {l.flag} {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => executeStreamCall(selectedLang)}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-500/20"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{isProcessing ? 'Sending...' : 'Execute API Call'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Real-Time JSON Output Response</span>
            </h3>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto min-h-[240px] leading-relaxed">
              {apiResponseJson || JSON.stringify(latestResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
