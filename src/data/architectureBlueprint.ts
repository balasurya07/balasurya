export interface LatencyPhase {
  phase: string;
  targetMs: number;
  actualAvgMs: number;
  description: string;
  technologies: string;
  tier: 'Edge' | 'Network' | 'Cloud AI' | 'Database' | 'Audio/TWS';
}

export const LATENCY_BUDGET: LatencyPhase[] = [
  {
    phase: '1. Sensor & Camera Capture',
    targetMs: 25,
    actualAvgMs: 22,
    description: 'Hardware camera sensor capture (1080p @ 30fps), downscale to 720p/480p on device NPU, H.264 intra-frame slice.',
    technologies: 'CameraX (Android) / AVFoundation (iOS) / WebRTC HW Encoder',
    tier: 'Edge',
  },
  {
    phase: '2. Ingestion & Edge Tokenizer',
    targetMs: 15,
    actualAvgMs: 12,
    description: 'Transport over WebRTC DataChannel or binary WebSocket with Protobuf / FlatBuffers serialization.',
    technologies: 'QUIC / WebRTC / FastAPI WebSocket Gateway',
    tier: 'Network',
  },
  {
    phase: '3. Multimodal AI Perception',
    targetMs: 50,
    actualAvgMs: 44,
    description: 'Parallel execution: YOLOv11-Nano (Food bounding & classes) + PaddleOCR (Price digits) + ArcFace (Facial vectors).',
    technologies: 'ONNX Runtime / TensorRT / Triton Inference Server / Gemini Flash',
    tier: 'Cloud AI',
  },
  {
    phase: '4. Vector & Relational Query',
    targetMs: 15,
    actualAvgMs: 11,
    description: 'HNSW Cosine Vector similarity search against 100k+ facial vectors + Daily budget envelope check.',
    technologies: 'PostgreSQL 16 + pgvector (m=16, ef=64) / Redis Cache',
    tier: 'Database',
  },
  {
    phase: '5. Language Switcher & Synthesis',
    targetMs: 40,
    actualAvgMs: 36,
    description: 'Automatic language detector (script Unicode + FastText) + Low-latency localized Neural Audio Synthesis.',
    technologies: 'FastSpeech2 / Piper TTS / Gemini Flash TTS / Web Speech API',
    tier: 'Cloud AI',
  },
  {
    phase: '6. Audio Stream to TWS Earbud',
    targetMs: 35,
    actualAvgMs: 32,
    description: 'Discreet Bluetooth LE Audio (LC3 low-complexity codec) stream straight into user earbud speaker driver.',
    technologies: 'Bluetooth LE Audio / LC3 Codec / Spatial Binaural Audio Cues',
    tier: 'Audio/TWS',
  },
];

export const TOTAL_LATENCY_BUDGET_MS = 180;
export const CURRENT_TOTAL_AVG_MS = 157;

export const ARCHITECTURE_TIERS = [
  {
    title: 'Edge Ingestion & Sensory Tier',
    badge: 'Device Layer',
    icon: 'Radio',
    color: 'emerald',
    components: [
      {
        name: 'TWS Smart Earbuds',
        desc: 'Continuous dual ambient microphones, bone-conduction voice activity detection (VAD), and Bluetooth LE Audio receiver for instant whispers.',
      },
      {
        name: 'Continuous Camera Stream',
        desc: 'Lightweight smart glasses or chest-mounted / phone-docked wide-angle optical sensor streaming keyframes at 1-2 FPS adaptive sampling.',
      },
      {
        name: 'Wearable Biometrics Sync',
        desc: 'BLE heart rate (PPG), HRV, galvanic skin response (GSR), and health platform integration (HealthKit / Health Connect).',
      },
      {
        name: 'On-Device Lightweight NPU',
        desc: 'Runs on-device face detector and motion blur filter, discarding 80% of idle frames before network transmission to conserve battery.',
      },
    ],
  },
  {
    title: 'Gateway & Orchestration Tier',
    badge: 'Ingestion Layer',
    icon: 'Cpu',
    color: 'cyan',
    components: [
      {
        name: 'WebRTC / WebSocket Gateway',
        desc: 'High-throughput asynchronous FastAPI and C++ socket cluster handling bi-directional audio/video framing with zero-copy buffers.',
      },
      {
        name: 'Multimodal Dispatcher',
        desc: 'Fan-out event bus decoupling sensory streams to vision, audio, and sensor analysis microservices concurrently.',
      },
      {
        name: 'Dynamic Language Switcher',
        desc: 'Sub-5ms script and token detection layer ensuring responses are translated and synthesized in the user native tongue.',
      },
    ],
  },
  {
    title: 'Intelligence & Perception Tier',
    badge: 'AI Core',
    icon: 'Sparkles',
    color: 'purple',
    components: [
      {
        name: 'Health Intelligence Correlator',
        desc: 'Correlates recognized food glycemic index with real-time wearable autonomic arousal (HRV/HR) to calculate immediate insulin/sugar risks.',
      },
      {
        name: 'Financial Guardian Agent',
        desc: 'Monitors geofenced retail locations, extracts prices via optical character recognition, and calculates remaining discretionary envelopes.',
      },
      {
        name: 'Social Memory & Semantic Search',
        desc: 'ArcFace 512-D vector extraction matching faces against historical interaction logs, CRM records, and previous conversation summaries.',
      },
    ],
  },
  {
    title: 'Persistence & Vector Storage Tier',
    badge: 'Data Layer',
    icon: 'Database',
    color: 'amber',
    components: [
      {
        name: 'PostgreSQL 16 + pgvector',
        desc: 'HNSW indexing on 512-D and 1536-D vector columns yielding sub-12ms cosine distance lookups across millions of social memories.',
      },
      {
        name: 'Redis In-Memory State Cache',
        desc: 'Stores active rolling session tokens, current location geofence states, and instantaneous heart rate sliding windows.',
      },
      {
        name: 'Audit & Compliance Vault',
        desc: 'Immutable append-only log storing every spoken audio intervention, user adherence status, and end-to-end telemetry.',
      },
    ],
  },
];
