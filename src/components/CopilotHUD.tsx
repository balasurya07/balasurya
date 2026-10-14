import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  DollarSign,
  Eye,
  Heart,
  Mic,
  MicOff,
  Moon,
  Play,
  Radio,
  RefreshCw,
  Sparkles,
  UserCheck,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageCode, LOCALIZATION_MATRIX, LocalizedAlert } from '../data/localizationData';
import { audioCopilot } from '../utils/audioSynthesizer';

interface BiometricsState {
  heartRate: number;
  hrv: number;
  sleepScore: number;
  glucose: number;
  stress: number;
}

export function CopilotHUD() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [autoLanguageDetect, setAutoLanguageDetect] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<'health' | 'finance' | 'social'>('health');
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [capturedVoiceText, setCapturedVoiceText] = useState<string>('');
  const [engineUsed, setEngineUsed] = useState<string>('Edge-Neural Pipeline (<160ms)');

  // Biometrics simulation state
  const [biometrics, setBiometrics] = useState<BiometricsState>({
    heartRate: 104,
    hrv: 38,
    sleepScore: 58,
    glucose: 114,
    stress: 74,
  });

  // Active intervention result
  const [currentAlert, setCurrentAlert] = useState<{
    module: 'HEALTH' | 'FINANCE' | 'SOCIAL';
    title: string;
    spokenText: string;
    urgency: 'CRITICAL' | 'WARNING' | 'ADVISORY';
    detectedData: Record<string, any>;
    latencyMs: number;
  }>({
    module: 'HEALTH',
    title: 'High Sugar Spike Risk',
    spokenText: LOCALIZATION_MATRIX[0].en,
    urgency: 'CRITICAL',
    detectedData: {
      item: 'Double Glazed Sugar Donut & Caramel Macchiato',
      sugarGrams: 42,
      calories: 460,
      glycemicIndex: 'HIGH',
    },
    latencyMs: 142,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update alert text when language changes
  useEffect(() => {
    let alertObj: LocalizedAlert;
    if (activeScenario === 'health') {
      alertObj = LOCALIZATION_MATRIX.find((a) => a.code === 'HIGH_SUGAR_SPIKE_RISK') || LOCALIZATION_MATRIX[0];
      setCurrentAlert((prev) => ({
        ...prev,
        module: 'HEALTH',
        title: 'High Sugar Spike Risk',
        spokenText: alertObj[selectedLanguage] || alertObj.en,
        urgency: alertObj.urgency,
        detectedData: {
          item: 'Double Glazed Sugar Donut & Caramel Macchiato',
          sugarGrams: 42,
          calories: 460,
          glycemicIndex: 'HIGH',
        },
      }));
    } else if (activeScenario === 'finance') {
      alertObj = LOCALIZATION_MATRIX.find((a) => a.code === 'IMPULSE_BUY_INTERVENTION') || LOCALIZATION_MATRIX[4];
      setCurrentAlert((prev) => ({
        ...prev,
        module: 'FINANCE',
        title: 'Discretionary Budget Breach',
        spokenText: alertObj[selectedLanguage] || alertObj.en,
        urgency: alertObj.urgency,
        detectedData: {
          item: 'Noise-Cancelling Headphones Pro',
          merchant: 'AudioTech Store #402',
          price: '$129.99',
          budgetRemaining: '$45.00',
        },
      }));
    } else {
      alertObj = LOCALIZATION_MATRIX.find((a) => a.code === 'FACE_RECOGNITION_COLLEAGUE') || LOCALIZATION_MATRIX[7];
      setCurrentAlert((prev) => ({
        ...prev,
        module: 'SOCIAL',
        title: 'Facial Memory Overlay',
        spokenText: alertObj[selectedLanguage] || alertObj.en,
        urgency: alertObj.urgency,
        detectedData: {
          name: 'Dr. Rajesh Ramanathan',
          role: 'VP AI Research, NeuralDynamics',
          lastMet: '3 weeks ago at Tech Summit',
          context: 'Promised to send latency paper; daughter started university',
        },
      }));
    }
  }, [selectedLanguage, activeScenario]);

  // Handle webcam toggle
  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsWebcamActive(true);
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
        alert('Webcam access was not granted or not available. Continuing in High-Fidelity Simulation Mode.');
      }
    }
  };

  // Play spoken alert
  const triggerAudioPlayback = (textToSpeak?: string) => {
    const text = textToSpeak || currentAlert.spokenText;
    if (isMuted) return;

    setIsSpeaking(true);
    const tone = currentAlert.urgency === 'CRITICAL' ? 'alarm_high' : currentAlert.urgency === 'WARNING' ? 'caution_chime' : 'subtle_whisper';
    audioCopilot.playTone(tone);

    setTimeout(() => {
      audioCopilot.speakAlert(text, selectedLanguage, () => {
        setIsSpeaking(false);
      });
    }, 280);
  };

  // Simulate or perform live multimodal Gemini inference
  const executeAnalysis = async () => {
    setIsAnalyzing(true);
    const startTime = performance.now();

    try {
      // Capture frame from webcam if active, else generate from scenario
      let imageBase64 = '';
      if (isWebcamActive && videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
        }
      } else {
        // High quality SVG scenario frame data placeholder
        imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      }

      const res = await fetch('/api/copilot/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mode: activeScenario,
          targetLanguage: selectedLanguage,
          biometrics,
        }),
      });

      const json = await res.json();
      const elapsed = Math.round(performance.now() - startTime);

      if (json && json.data) {
        const d = json.data;
        const newSpokenText = d.audioAlert || currentAlert.spokenText;

        setCurrentAlert({
          module: activeScenario.toUpperCase() as any,
          title: activeScenario === 'health' ? 'Nutrition & Biometric Correlation' : activeScenario === 'finance' ? 'POS Financial Guardian' : 'Social Semantic Memory',
          spokenText: newSpokenText,
          urgency: d.riskLevel || 'CRITICAL',
          detectedData: {
            item: d.detectedItem || d.matchedContact,
            ...d,
          },
          latencyMs: elapsed,
        });

        setEngineUsed(json.engine === 'gemini-3.8-flash' ? 'Cloud Gemini 3.8 Flash (Multimodal)' : 'Local Neural Edge Accelerator (<160ms)');

        // Trigger earbud speech
        triggerAudioPlayback(newSpokenText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Automated language listener using browser SpeechRecognition
  const handleMicrophoneLanguageListener = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. You can select your language using the buttons below.');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListeningMic(true);
    setCapturedVoiceText('Listening for native speech (Tamil, Hindi, Spanish, German, English)...');

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCapturedVoiceText(`Recognized: "${transcript}"`);
      setIsListeningMic(false);

      // Automated language detection
      let detectedLang: LanguageCode = 'en';
      // Detect Tamil unicode
      if (/[\u0B80-\u0BFF]/.test(transcript)) {
        detectedLang = 'ta';
      } else if (/[\u0900-\u097F]/.test(transcript)) {
        detectedLang = 'hi';
      } else if (/\b(el|la|por|favor|hola|gracias|buenos|días)\b/i.test(transcript)) {
        detectedLang = 'es';
      } else if (/\b(der|die|das|und|bitte|guten|morgen|danke)\b/i.test(transcript)) {
        detectedLang = 'de';
      }

      if (autoLanguageDetect) {
        setSelectedLanguage(detectedLang);
        audioCopilot.playTone('system_ping');
      }
    };

    recognition.onerror = () => {
      setIsListeningMic(false);
      setCapturedVoiceText('Could not capture audio stream.');
    };

    recognition.onend = () => {
      setIsListeningMic(false);
    };

    recognition.start();
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold tracking-wider font-mono text-cyan-400 uppercase">
                Active 24/7 Ambient Copilot HUD
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                LIVE STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Earbud Bluetooth LE Audio: <span className="text-emerald-400 font-semibold">CONNECTED</span> | Telemetry Sync: <span className="text-emerald-400 font-semibold">120 Hz</span>
            </p>
          </div>
        </div>

        {/* Multilingual Switcher Matrix */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-slate-950/80 rounded-lg p-1 border border-slate-700/60">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  audioCopilot.playTone('subtle_whisper');
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title={`Switch Copilot speech & OCR to ${lang.name}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoLanguageDetect(!autoLanguageDetect)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium border transition-all flex items-center space-x-1 ${
              autoLanguageDetect
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Auto-detect spoken voice and OCR language"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Switcher: {autoLanguageDetect ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleMicrophoneLanguageListener}
            disabled={isListeningMic}
            className={`p-2 rounded-lg border text-xs transition-all flex items-center space-x-1 ${
              isListeningMic
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Speak into microphone to test native language voice switching"
          >
            <Mic className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{isListeningMic ? 'Listening...' : 'Voice Test'}</span>
          </button>
        </div>
      </div>

      {capturedVoiceText && (
        <div className="p-2.5 bg-slate-900/90 border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span>{capturedVoiceText}</span>
          <button onClick={() => setCapturedVoiceText('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main HUD Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multimodal Optical Viewport & HUD Reticle (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/40 aspect-[16/10]">
            {/* Real Webcam or Dynamic High-Res Simulation Feed */}
            {isWebcamActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                {activeScenario === 'health' && (
                  <div className="w-full h-full relative bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/20 flex flex-col items-center justify-center p-8">
                    {/* Simulated High-Res Food Scene Visual */}
                    <div className="relative flex flex-col items-center">
                      <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-amber-600/30 via-rose-700/20 to-amber-950/50 flex items-center justify-center border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20">
                        <div className="w-44 h-44 rounded-full border-4 border-dashed border-amber-400/40 flex items-center justify-center">
                          <div className="text-center p-4">
                            <span className="text-5xl">🍩 🥤</span>
                            <div className="mt-2 text-xs font-bold text-amber-300 font-mono">
                              FOOD TARGET LOCKED
                            </div>
                            <div className="text-[11px] text-slate-300 font-mono">
                              Donut + Caramel Macchiato
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeScenario === 'finance' && (
                  <div className="w-full h-full relative bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/20 flex flex-col items-center justify-center p-8">
                    <div className="w-72 p-5 rounded-xl bg-slate-900/90 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-500/20 font-mono">
                      <div className="text-center pb-3 border-b border-emerald-500/30">
                        <div className="text-xs text-slate-400">AUDIO-TECH ELECTRONICS</div>
                        <div className="text-base font-bold text-emerald-400">CHECKOUT REGISTER #04</div>
                      </div>
                      <div className="my-4 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>NC Headphones Pro</span>
                          <span className="font-bold text-white">$129.99</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Sales Tax (8.25%)</span>
                          <span>$10.72</span>
                        </div>
                        <div className="border-t border-slate-700 pt-2 flex justify-between text-sm font-bold text-rose-400">
                          <span>TOTAL DUE:</span>
                          <span>$140.71</span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-rose-500/20 border border-rose-500/40 text-[11px] text-rose-300 text-center font-bold">
                        ⚠️ SCAN DETECTED: Tap-to-Pay in proximity
                      </div>
                    </div>
                  </div>
                )}

                {activeScenario === 'social' && (
                  <div className="w-full h-full relative bg-gradient-to-tr from-slate-950 via-slate-900 to-purple-950/20 flex flex-col items-center justify-center p-8">
                    <div className="relative flex flex-col items-center">
                      <div className="w-48 h-48 rounded-2xl bg-gradient-to-b from-purple-500/20 to-slate-900 border-2 border-purple-500/60 flex flex-col items-center justify-center shadow-2xl shadow-purple-500/30 relative">
                        {/* Simulated Facial landmarks reticle */}
                        <div className="w-32 h-36 border border-cyan-400/50 rounded-lg relative flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-8 left-6"></div>
                          <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-8 right-6"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 absolute top-16"></div>
                          <div className="w-6 h-1 border-b border-cyan-400 absolute bottom-10"></div>
                          <span className="text-4xl">👨‍💼</span>
                        </div>
                        <div className="mt-2 text-xs font-mono text-purple-300 font-bold">
                          ARCFACE 512-D MATCHED (94.2%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hidden canvas for video frame sampling */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanline CRT overlay */}
            <div className="absolute inset-0 scanline pointer-events-none opacity-40"></div>

            {/* Futuristic HUD Scanning Reticles & Corner Brackets */}
            <div className="absolute inset-4 pointer-events-none border border-cyan-500/20 rounded-lg">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

              {/* Scanning laser line animation */}
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent laser-bar shadow-[0_0_12px_#06b6d4]"></div>

              {/* Top Left HUD Telemetry Overlay */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-500/30 font-mono text-[11px] text-cyan-300 space-y-0.5">
                <div>MODE: <span className="text-white font-bold">{activeScenario.toUpperCase()} SENSOR</span></div>
                <div>FPS: <span className="text-emerald-400 font-bold">29.98</span> | RES: <span className="text-white">1280x720</span></div>
                <div>OPTICAL LATENCY: <span className="text-emerald-400 font-bold">22ms</span></div>
              </div>

              {/* Top Right Language & Audio Cue Status */}
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-500/30 font-mono text-[11px] text-right space-y-0.5">
                <div className="text-slate-400">
                  NATIVE TONGUE: <span className="text-cyan-400 font-bold">{selectedLanguage.toUpperCase()}</span>
                </div>
                <div className="text-slate-400">
                  INTERVENTION: <span className={currentAlert.urgency === 'CRITICAL' ? 'text-rose-400 font-bold animate-pulse' : 'text-amber-400 font-bold'}>{currentAlert.urgency}</span>
                </div>
              </div>

              {/* Dynamic Target Box in Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-400/40 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 bg-slate-950/70 px-2 py-0.5 rounded">
                  <span>TARGET LOCK</span>
                  <span className="animate-pulse">● TRACKING</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 bg-slate-950/70 px-2 py-0.5 rounded">
                  <span>CONFIDENCE: 98.4%</span>
                  <span>ECHO: 0.12s</span>
                </div>
              </div>
            </div>

            {/* Bottom HUD Bar inside viewport */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-4 py-2 bg-slate-950/85 backdrop-blur-md rounded-lg border border-cyan-500/30 font-mono text-xs">
              <div className="flex items-center space-x-2 text-cyan-300">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Ambient Audio VAD: <span className="text-white">ACTIVE</span></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-slate-400">Total Loop: <span className="text-emerald-400 font-bold">{currentAlert.latencyMs}ms</span> (Sub-180ms Target)</span>
              </div>
            </div>
          </div>

          {/* Scenario Selector & Camera Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">Scenario Preset:</span>
              <button
                onClick={() => setActiveScenario('health')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeScenario === 'health'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                🥗 Food & Health Intelligence
              </button>
              <button
                onClick={() => setActiveScenario('finance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeScenario === 'finance'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                💳 Financial Guardian POS
              </button>
              <button
                onClick={() => setActiveScenario('social')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeScenario === 'social'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                👥 Social Memory & Facial Mesh
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleWebcam}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                  isWebcamActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isWebcamActive ? 'Disconnect Camera' : 'Use Live Webcam'}</span>
              </button>

              <button
                onClick={executeAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-1.5 rounded-lg text-xs font-bold font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Processing Frame...' : 'Trigger AI Analysis'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Spoken Audio Intervention + Wearable Biometrics (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Audio Intervention Earbud Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/30 shadow-xl shadow-cyan-950/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                  TWS Audio Intervention
                </h3>
              </div>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded border text-xs ${
                  isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title={isMuted ? 'Unmute Earbuds' : 'Mute Earbuds'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Audio Wave Visualizer when Speaking */}
            <div className="flex items-center justify-center space-x-1 h-8 px-4 rounded-lg bg-slate-950 border border-slate-800">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking
                      ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: isSpeaking ? `${Math.max(4, Math.sin(i * 0.6 + Date.now() / 200) * 24 + 10)}px` : '4px',
                  }}
                />
              ))}
            </div>

            {/* Spoken Alert in Native Tongue */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">DISPATCHED AUDIO:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  {selectedLanguage.toUpperCase()} NATIVE
                </span>
              </div>
              <p className="text-sm font-semibold text-cyan-100 leading-relaxed font-sans">
                "{currentAlert.spokenText}"
              </p>
            </div>

            {/* Audio Playback Trigger Button */}
            <button
              onClick={() => triggerAudioPlayback()}
              disabled={isSpeaking || isMuted}
              className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isSpeaking ? 'Playing in TWS Earbuds...' : 'Speak In Native Tongue (TTS)'}</span>
            </button>

            {/* Context & Reasoning Details */}
            <div className="text-xs font-mono text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Inference Pipeline:</span>
                <span className="text-slate-200">{engineUsed}</span>
              </div>
              <div className="flex justify-between">
                <span>Decision Latency:</span>
                <span className="text-emerald-400 font-bold">{currentAlert.latencyMs} ms</span>
              </div>
            </div>
          </div>

          {/* Live Wearable Biometrics HUD Strip */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Wearable Telemetry Sync
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE PPG
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {/* Heart Rate */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>HEART RATE</span>
                  </div>
                  <div className="text-base font-bold text-rose-400 mt-0.5">
                    {biometrics.heartRate} <span className="text-[10px] text-slate-400 font-normal">BPM</span>
                  </div>
                </div>
                <div className="h-6 w-12 flex items-center space-x-0.5">
                  <div className="w-1.5 h-3 bg-rose-500/50 rounded-sm"></div>
                  <div className="w-1.5 h-6 bg-rose-500 rounded-sm animate-pulse"></div>
                  <div className="w-1.5 h-4 bg-rose-500/60 rounded-sm"></div>
                  <div className="w-1.5 h-5 bg-rose-500/80 rounded-sm"></div>
                </div>
              </div>

              {/* Sleep Score */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>SLEEP SCORE</span>
                  </div>
                  <div className="text-base font-bold text-indigo-400 mt-0.5">
                    {biometrics.sleepScore}%
                  </div>
                </div>
                <div className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10">
                  FATIGUED
                </div>
              </div>

              {/* Stress Gauge */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>STRESS INDEX</span>
                  </div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">
                    {biometrics.stress} / 100
                  </div>
                </div>
                <div className="text-[10px] text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-500/10">
                  ELEVATED
                </div>
              </div>

              {/* Blood Glucose */}
              <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">EST. GLUCOSE</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">
                    {biometrics.glucose} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span>
                  </div>
                </div>
                <div className="text-[10px] text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-500/10">
                  NORMAL
                </div>
              </div>
            </div>

            {/* Quick interactive biometrics simulator */}
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Simulate High HR State:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setBiometrics({ ...biometrics, heartRate: 72, sleepScore: 84 })}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Resting (72)
                </button>
                <button
                  onClick={() => setBiometrics({ ...biometrics, heartRate: 114, sleepScore: 54 })}
                  className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40"
                >
                  Elevated (114)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
