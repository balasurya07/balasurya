import React, { useState } from 'react';
import {
  Globe,
  Copy,
  Check,
  Download,
  Volume2,
  Sparkles,
  AlertTriangle,
  Heart,
  DollarSign,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { LOCALIZATION_MATRIX, SUPPORTED_LANGUAGES, LocalizedAlert, LanguageCode } from '../data/localizationData';
import { audioCopilot } from '../utils/audioSynthesizer';

export function LocalizationMatrixView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [activeLangForAudio, setActiveLangForAudio] = useState<LanguageCode>('ta');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const filteredAlerts = LOCALIZATION_MATRIX.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.es.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.de.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePlayAudio = (alertItem: LocalizedAlert, lang: LanguageCode) => {
    const textToSpeak = alertItem[lang] || alertItem.en;
    setActiveSpeechId(`${alertItem.id}-${lang}`);
    audioCopilot.playTone(alertItem.audioTone);

    setTimeout(() => {
      audioCopilot.speakAlert(textToSpeak, lang, () => {
        setActiveSpeechId(null);
      });
    }, 280);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(LOCALIZATION_MATRIX, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(LOCALIZATION_MATRIX, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copilot_localization_matrix_5lang.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-semibold uppercase">
            <Globe className="w-4 h-4" />
            <span>Native Low-Latency Localization Matrix</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            5-Language Audio & Text Localization Map
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Zero-delay dispatch for English, Tamil (தமிழ்), Hindi (हिंदी), Spanish (Español), and German (Deutsch). Click any audio button to audition native earbud TTS playback.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyJSON}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 flex items-center space-x-1.5 transition-all shadow-lg shadow-purple-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download .json</span>
          </button>
        </div>
      </div>

      {/* Language Flags Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-3"
          >
            <span className="text-2xl">{lang.flag}</span>
            <div>
              <div className="text-xs font-bold text-white">{lang.name}</div>
              <div className="text-[11px] font-mono text-cyan-400">{lang.nativeName}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-400">Filter Domain:</span>
          {['ALL', 'HEALTH', 'FINANCE', 'SOCIAL', 'SYSTEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords in any language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Alert Cards Matrix */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/30 transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    alert.urgency === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : alert.urgency === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {alert.urgency}
                </span>
                <span className="font-mono text-xs font-bold text-white tracking-wide">
                  {alert.code}
                </span>
                <span className="text-slate-500 text-xs">({alert.id})</span>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Action: <span className="text-slate-200">{alert.suggestedAction}</span>
              </div>
            </div>

            {/* 5-Language Translations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* English */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="font-bold text-cyan-400">🇺🇸 English</span>
                    <span>en-US</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{alert.en}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(alert, 'en')}
                  className={`mt-2.5 py-1 px-2 rounded text-[10px] font-mono flex items-center justify-center space-x-1 border transition-all ${
                    activeSpeechId === `${alert.id}-en`
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{activeSpeechId === `${alert.id}-en` ? 'Speaking...' : 'Audition Voice'}</span>
                </button>
              </div>

              {/* Tamil */}
              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 mb-1">
                    <span className="font-bold text-purple-400">🇮🇳 தமிழ் (Tamil)</span>
                    <span>ta-IN</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{alert.ta}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(alert, 'ta')}
                  className={`mt-2.5 py-1 px-2 rounded text-[10px] font-mono flex items-center justify-center space-x-1 border transition-all ${
                    activeSpeechId === `${alert.id}-ta`
                      ? 'bg-purple-500 text-slate-950 font-bold border-purple-400 animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{activeSpeechId === `${alert.id}-ta` ? 'Speaking...' : 'குரல் கேள் (Audio)'}</span>
                </button>
              </div>

              {/* Hindi */}
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 mb-1">
                    <span className="font-bold text-amber-400">🇮🇳 हिंदी (Hindi)</span>
                    <span>hi-IN</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{alert.hi}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(alert, 'hi')}
                  className={`mt-2.5 py-1 px-2 rounded text-[10px] font-mono flex items-center justify-center space-x-1 border transition-all ${
                    activeSpeechId === `${alert.id}-hi`
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{activeSpeechId === `${alert.id}-hi` ? 'Speaking...' : 'आवाज सुनें (Audio)'}</span>
                </button>
              </div>

              {/* Spanish */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="font-bold text-emerald-400">🇪🇸 Español</span>
                    <span>es-ES</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{alert.es}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(alert, 'es')}
                  className={`mt-2.5 py-1 px-2 rounded text-[10px] font-mono flex items-center justify-center space-x-1 border transition-all ${
                    activeSpeechId === `${alert.id}-es`
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{activeSpeechId === `${alert.id}-es` ? 'Speaking...' : 'Escuchar Voz'}</span>
                </button>
              </div>

              {/* German */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="font-bold text-rose-400">🇩🇪 Deutsch</span>
                    <span>de-DE</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{alert.de}</p>
                </div>
                <button
                  onClick={() => handlePlayAudio(alert, 'de')}
                  className={`mt-2.5 py-1 px-2 rounded text-[10px] font-mono flex items-center justify-center space-x-1 border transition-all ${
                    activeSpeechId === `${alert.id}-de`
                      ? 'bg-rose-500 text-slate-950 font-bold border-rose-400 animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{activeSpeechId === `${alert.id}-de` ? 'Speaking...' : 'Audio abspielen'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
