export interface LocalizedAlert {
  id: string;
  category: 'HEALTH' | 'FINANCE' | 'SOCIAL' | 'SYSTEM';
  code: string;
  urgency: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  en: string;
  ta: string; // Tamil
  hi: string; // Hindi
  es: string; // Spanish
  de: string; // German
  audioTone: 'alarm_high' | 'caution_chime' | 'subtle_whisper' | 'system_ping';
  suggestedAction: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', locale: 'en-US', flag: '🇺🇸' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', locale: 'ta-IN', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', locale: 'hi-IN', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', locale: 'es-ES', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', locale: 'de-DE', flag: '🇩🇪' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const LOCALIZATION_MATRIX: LocalizedAlert[] = [
  // Health Intelligence Alerts
  {
    id: 'HLTH_001',
    category: 'HEALTH',
    code: 'HIGH_SUGAR_SPIKE_RISK',
    urgency: 'CRITICAL',
    en: 'High sugar alert. Your heart rate is elevated at 104 BPM and sleep recovery was poor. Consider skipping this 42g sugar dessert.',
    ta: 'எச்சரிக்கை: உயர் சர்க்கரை ஆபத்து! உங்கள் இதயத் துடிப்பு 104 BPM ஆக உயர்ந்துள்ளது. இந்த 42 கிராம் சர்க்கரை இனிப்பைத் தவிர்க்கவும்.',
    hi: 'उच्च शर्करा चेतावनी! आपकी हृदय गति 104 बीपीएम पर बढ़ी हुई है और नींद कम थी। कृपया इस 42 ग्राम चीनी वाली मिठाई से बचें।',
    es: 'Alerta de azúcar alto. Tu frecuencia cardíaca está en 104 BPM y tu recuperación de sueño fue baja. Evita este postre con 42g de azúcar.',
    de: 'Achtung: Hoher Zuckeralarm. Ihre Herzfrequenz liegt bei 104 BPM bei unzureichendem Schlaf. Bitte meiden Sie dieses 42g zuckerhaltige Dessert.',
    audioTone: 'alarm_high',
    suggestedAction: 'Substitute with unsweetened green tea or electrolyte water.',
  },
  {
    id: 'HLTH_002',
    category: 'HEALTH',
    code: 'CALORIE_BUDGET_EXCEEDED',
    urgency: 'WARNING',
    en: 'Calorie threshold warning. This meal exceeds your daily metabolic target by 380 kcal.',
    ta: 'கலோரி வரம்பு எச்சரிக்கை. இந்த உணவு உங்கள் தினசரி வளர்சிதை மாற்ற இலக்கை விட 380 கிலோகலோரி அதிகமாகும்.',
    hi: 'कैलोरी सीमा चेतावनी! यह भोजन आपके दैनिक लक्ष्य से 380 किलोकैलोरी अधिक है।',
    es: 'Advertencia de calorías. Esta comida supera su objetivo metabólico diario en 380 kcal.',
    de: 'Kaloriengrenze überschritten. Diese Mahlzeit überschreitet Ihr tägliches Stoffwechselziel um 380 kcal.',
    audioTone: 'caution_chime',
    suggestedAction: 'Consume a half-portion or plan an evening 30-minute cardio walk.',
  },
  {
    id: 'HLTH_003',
    category: 'HEALTH',
    code: 'ALLERGEN_PEANUT_DETECTED',
    urgency: 'CRITICAL',
    en: 'Severe allergen hazard. Optical scan detected peanut traces matching your anaphylaxis profile.',
    ta: 'கடுமையான ஒவ்வாமை ஆபத்து! ஒளியியல் ஸ்கேனில் உங்கள் சுயவிவரத்தில் உள்ள கடலை கூறுகள் கண்டறியப்பட்டன.',
    hi: 'गंभीर एलर्जी चेतावनी! ऑप्टिकल स्कैन में मूंगफली के अंश पाए गए हैं जो आपकी एलर्जी सूची में हैं।',
    es: 'Peligro grave de alérgeno. El escaneo óptico detectó trazas de cacahuete coincidentes con su perfil.',
    de: 'Schwere Allergenwarnung! Der optische Scan hat Spuren von Erdnüssen erkannt, die Ihrem Allergieprofil entsprechen.',
    audioTone: 'alarm_high',
    suggestedAction: 'Do not consume. Request ingredient verification from the chef.',
  },
  {
    id: 'HLTH_004',
    category: 'HEALTH',
    code: 'DEHYDRATION_FATIGUE_PREVENTION',
    urgency: 'ADVISORY',
    en: 'Hydration prompt. High ambient temperature and low galvanic skin response detected. Drink 250ml water.',
    ta: 'நீரேற்ற நினைவூட்டல்: அதிக வெப்பம் மற்றும் குறைந்த தோல் ஈரப்பதம் கண்டறியப்பட்டது. 250 மி.லி தண்ணீர் குடிக்கவும்.',
    hi: 'जलयोजन संकेत: उच्च परिवेश तापमान और कम त्वचा नमी का पता चला है। कृपया 250 मिली पानी पिएं।',
    es: 'Aviso de hidratación. Alta temperatura ambiente detectada. Beba 250 ml de agua.',
    de: 'Flüssigkeitserinnerung: Hohe Umgebungstemperatur erkannt. Trinken Sie jetzt 250 ml Wasser.',
    audioTone: 'subtle_whisper',
    suggestedAction: 'Take a hydration break to stabilize cognitive performance.',
  },

  // Financial Guardian Alerts
  {
    id: 'FIN_001',
    category: 'FINANCE',
    code: 'IMPULSE_BUY_INTERVENTION',
    urgency: 'CRITICAL',
    en: 'Budget intervention. This $129.99 purchase will exceed your remaining $45 discretionary limit by $84.99.',
    ta: 'பட்ஜெட் தலையீடு: இந்த $129.99 கொள்முதல் உங்கள் மீதமுள்ள $45 செலவு வரம்பை $84.99 ஆல் மீறும்.',
    hi: 'बजट हस्तक्षेप: यह $129.99 की खरीद आपकी शेष $45 की बजट सीमा को $84.99 से पार कर जाएगी।',
    es: 'Intervención de presupuesto. Esta compra de $129.99 superará su límite disponible de $45 por $84.99.',
    de: 'Budget-Intervention: Dieser Kauf von $129,99 übersteigt Ihr verbleibendes Limit von $45 um $84,99.',
    audioTone: 'alarm_high',
    suggestedAction: 'Pause transaction. Add to 48-hour cooling-off wishlist.',
  },
  {
    id: 'FIN_002',
    category: 'FINANCE',
    code: 'RECURRING_SUBSCRIPTION_TRAP',
    urgency: 'WARNING',
    en: 'Subscription notice. OCR checkout indicates an auto-renewing annual subscription of $99/year after 7 days.',
    ta: 'சந்தா அறிவிப்பு: 7 நாட்களுக்குப் பிறகு ஆண்டுக்கு $99 தானாகப் புதுப்பிக்கப்படும் சந்தா கண்டறியப்பட்டது.',
    hi: 'सदस्यता सूचना: 7 दिनों के बाद $99/वर्ष की स्वचालित नवीनीकरण सदस्यता शुरू होगी।',
    es: 'Aviso de suscripción. El escaneo indica una renovación anual automática de $99/año tras 7 días.',
    de: 'Abonnement-Warnung: Nach 7 Tagen verlängert sich dieser Dienst automatisch für $99/Jahr.',
    audioTone: 'caution_chime',
    suggestedAction: 'Verify trial cancellation policy before confirming checkout.',
  },
  {
    id: 'FIN_003',
    category: 'FINANCE',
    code: 'DINING_OUT_QUOTA_REACHED',
    urgency: 'ADVISORY',
    en: 'Dining budget advisory. You have utilized 92% of this month’s restaurant allowance.',
    ta: 'உணவக பட்ஜெட் ஆலோசனை: இந்த மாதத்தின் உணவக ஒதுக்கீட்டில் 92% ஐ நீங்கள் ஏற்கனவே பயன்படுத்திவிட்டீர்கள்.',
    hi: 'भोजन बजट सलाह: आपने इस महीने के रेस्तरां भत्ते का 92% उपयोग कर लिया है।',
    es: 'Aviso de gastos en restaurantes. Ha utilizado el 92% de su asignación mensual.',
    de: 'Gastronomie-Budget: Sie haben 92% Ihres monatlichen Restaurant-Budgets aufgebraucht.',
    audioTone: 'subtle_whisper',
    suggestedAction: 'Opt for home cooking for the remainder of this week.',
  },

  // Social Memory Extension Alerts
  {
    id: 'SOC_001',
    category: 'SOCIAL',
    code: 'FACE_RECOGNITION_COLLEAGUE',
    urgency: 'ADVISORY',
    en: 'Social recall: Dr. Rajesh Ramanathan, VP of AI Research. Met 3 weeks ago at Tech Summit. Remind him about the latency paper.',
    ta: 'சமூக நினைவூட்டல்: முனைவர் ராஜேஷ் ராமநாதன், AI ஆராய்ச்சி பிரிவு தலைவர். 3 வாரங்களுக்கு முன்பு மாநாட்டில் சந்தித்தீர்கள்.',
    hi: 'स्मृति संकेत: डॉ. राजेश रामनाथन, एआई रिसर्च उपाध्यक्ष। 3 सप्ताह पहले टेक समिट में मिले थे। उन्हें रिसर्च पेपर याद दिलाएं।',
    es: 'Recordatorio social: Dr. Rajesh Ramanathan, VP de Investigación de IA. Se conocieron hace 3 semanas en el Tech Summit.',
    de: 'Soziale Erinnerung: Dr. Rajesh Ramanathan, VP für KI-Forschung. Vor 3 Wochen auf dem Tech Summit getroffen.',
    audioTone: 'subtle_whisper',
    suggestedAction: 'Greet with: "Hello Dr. Rajesh, great seeing you after the summit."',
  },
  {
    id: 'SOC_002',
    category: 'SOCIAL',
    code: 'FOLLOWUP_COMMITMENT_PENDING',
    urgency: 'WARNING',
    en: 'Unresolved commitment: You promised to email Sarah the quarterly project milestones yesterday.',
    ta: 'நிலுவையில் உள்ள வாக்குறுதி: காலாண்டு மைல்கற்களை நேற்று சாராவுக்கு மின்னஞ்சல் செய்வதாக உறுதியளித்திருந்தீர்கள்.',
    hi: 'लंबित वादा: आपने कल सारा को त्रैमासिक प्रोजेक्ट रिपोर्ट ईमेल करने का वादा किया था।',
    es: 'Compromiso pendiente: Le prometiste enviar por correo a Sarah los hitos del proyecto ayer.',
    de: 'Offene Zusage: Sie haben versprochen, Sarah gestern die Quartalsmeilensteine zu mailen.',
    audioTone: 'caution_chime',
    suggestedAction: 'Acknowledge the delay immediately or schedule dispatch for this evening.',
  },
  {
    id: 'SOC_003',
    category: 'SOCIAL',
    code: 'CLIENT_FAMILY_CONTEXT',
    urgency: 'ADVISORY',
    en: 'Context cue: Elena Rostova. Her daughter Maya just started Stanford university last month.',
    ta: 'சூழல் குறிப்பு: எலெனா ரோஸ்டோவா. அவரது மகள் மாயா கடந்த மாதம் ஸ்டான்போர்டில் சேர்ந்தார்.',
    hi: 'संदर्भ संकेत: एलेना रोस्तोवा। उनकी बेटी माया ने पिछले महीने स्टैनफोर्ड में प्रवेश लिया है।',
    es: 'Dato de contexto: Elena Rostova. Su hija Maya comenzó en Stanford el mes pasado.',
    de: 'Kontext-Hinweis: Elena Rostova. Ihre Tochter Maya hat letzten Monat in Stanford begonnen.',
    audioTone: 'subtle_whisper',
    suggestedAction: 'Inquire politely about how Maya is settling into campus life.',
  },

  // System & Hardware Telemetry
  {
    id: 'SYS_001',
    category: 'SYSTEM',
    code: 'LOW_LATENCY_MESH_ACTIVE',
    urgency: 'ADVISORY',
    en: 'Copilot online. Continuous multimodal feed active. Sub-180ms neural edge link established.',
    ta: 'கோபைலட் இயங்குகிறது. மல்டி-மோடல் கண்காணிப்பு மற்றும் அதிவேக இணைப்பு நிலைநிறுத்தப்பட்டது.',
    hi: 'कोपायलट सक्रिय है। निरंतर मल्टी-मोडल फीड और अति-निम्न विलंबता लिंक स्थापित।',
    es: 'Copiloto en línea. Enlace neuronal de baja latencia menor a 180ms establecido.',
    de: 'Copilot online. Kontinuierlicher Feed aktiv. Sub-180ms neuronale Verbindung hergestellt.',
    audioTone: 'system_ping',
    suggestedAction: 'Ambient listening and optical HUD monitoring actively safeguarding.',
  },
];
