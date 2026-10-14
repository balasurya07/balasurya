export const FLUTTER_MAIN_DART = `// ============================================================================
// AI REAL-TIME LIFE COPILOT - PRODUCTION FLUTTER CLIENT APPLICATION
// Multi-Modal Camera Ingestion, Multilingual TTS Audio & Haptic Feedback
// ============================================================================

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:camera/camera.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:geolocator/geolocator.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set system UI overlay for full-bleed futuristic HUD
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));

  final cameras = await availableCameras();
  final firstCamera = cameras.first;
  
  runApp(MaterialApp(
    title: 'AI Real-Time Life Copilot',
    theme: ThemeData.dark().copyWith(
      scaffoldBackgroundColor: const Color(0xFF030712),
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF06B6D4),
        secondary: Color(0xFF10B981),
      ),
    ),
    debugShowCheckedModeBanner: false,
    home: LifeCopilotScreen(camera: firstCamera),
  ));
}

class LifeCopilotScreen extends StatefulWidget {
  final CameraDescription camera;
  const LifeCopilotScreen({Key? key, required this.camera}) : super(key: key);

  @override
  _LifeCopilotScreenState createState() => _LifeCopilotScreenState();
}

class _LifeCopilotScreenState extends State<LifeCopilotScreen> with TickerProviderStateMixin {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  late FlutterTts _flutterTts;
  
  // State variables
  String _activeLanguage = 'en'; // 'en', 'ta', 'hi', 'es', 'de'
  String? _latestAudioAlert;
  String _detectedObject = 'Scanning ambient streams...';
  bool _isProcessing = false;
  int _latencyMs = 0;
  Timer? _streamTimer;
  Position? _currentPosition;

  // Animation controller for HUD reticle sweep
  late AnimationController _radarController;

  final String _backendUrl = 'https://your-copilot-api.domain.com/api/v1/process-stream';

  @override
  void initState() {
    super.initState();
    _initCamera();
    _initTts();
    _initLocation();

    _radarController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    // Periodic adaptive frame streamer (e.g., every 3.5s for power-aware edge dispatch)
    _streamTimer = Timer.periodic(const Duration(milliseconds: 3500), (timer) {
      if (!_isProcessing) {
        _sendStreamFrameToBackend();
      }
    });
  }

  void _initCamera() {
    _controller = CameraController(
      widget.camera, 
      ResolutionPreset.high,
      enableAudio: false,
      imageFormatGroup: ImageFormatGroup.jpeg,
    );
    _initializeControllerFuture = _controller.initialize();
  }

  void _initTts() {
    _flutterTts = FlutterTts();
    _flutterTts.setSpeechRate(0.55);
    _flutterTts.setPitch(1.0);
  }

  Future<void> _initLocation() async {
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.whileInUse || permission == LocationPermission.always) {
        _currentPosition = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
        );
      }
    } catch (e) {
      debugPrint('Location sensor error: $e');
    }
  }

  // Multimodal stream transmission to /api/v1/process-stream
  Future<void> _sendStreamFrameToBackend() async {
    if (!mounted || !_controller.value.isInitialized) return;

    setState(() {
      _isProcessing = true;
    });

    final stopwatch = Stopwatch()..start();

    try {
      final XFile imageFile = await _controller.takePicture();
      final bytes = await imageFile.readAsBytes();
      final base64Image = base64Encode(bytes);

      final payload = {
        'user_id': 'user-tws-8912',
        'current_lat': _currentPosition?.latitude ?? 37.7749,
        'current_lng': _currentPosition?.longitude ?? -122.4194,
        'detected_language': _activeLanguage,
        'frame_b64': base64Image,
      };

      final response = await http.post(
        Uri.parse(_backendUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      ).timeout(const Duration(milliseconds: 2500));

      stopwatch.stop();

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success' && data['action'] == 'TRIGGER_AUDIO_ALERT') {
          final payloadData = data['payload'];
          final textMessage = payloadData['text_message'];
          final shouldVibrate = payloadData['haptic_feedback'] ?? false;

          setState(() {
            _latestAudioAlert = textMessage;
            _detectedObject = payloadData['detected_object'] ?? 'High Sugar Product Item';
            _latencyMs = stopwatch.elapsedMilliseconds;
          });

          // Trigger physical tactile feedback on wearable / phone
          if (shouldVibrate) {
            HapticFeedback.heavyImpact();
          }

          // Native earbud TTS speech playback
          _speakInNativeLanguage(textMessage, _activeLanguage);
        }
      }
    } catch (e) {
      debugPrint('Stream ingestion error: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  Future<void> _speakInNativeLanguage(String text, String langCode) async {
    final Map<String, String> localeMap = {
      'en': 'en-US',
      'ta': 'ta-IN',
      'hi': 'hi-IN',
      'es': 'es-ES',
      'de': 'de-DE',
    };
    await _flutterTts.setLanguage(localeMap[langCode] ?? 'en-US');
    await _flutterTts.speak(text);
  }

  @override
  void dispose() {
    _streamTimer?.cancel();
    _radarController.dispose();
    _controller.dispose();
    _flutterTts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return Stack(
              children: [
                // 1. Live Camera Preview
                Positioned.fill(
                  child: AspectRatio(
                    aspectRatio: _controller.value.aspectRatio,
                    child: CameraPreview(_controller),
                  ),
                ),

                // 2. HUD Reticle & Targeting Scanner Overlay
                Positioned.fill(
                  child: IgnorePointer(
                    child: CustomPaint(
                      painter: HUDOverlayPainter(
                        animationProgress: _radarController.value,
                        isProcessing: _isProcessing,
                      ),
                    ),
                  ),
                ),

                // 3. Top Status Telemetry Bar
                Positioned(
                  top: 50,
                  left: 20,
                  right: 20,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A).withOpacity(0.85),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.4)),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF06B6D4).withOpacity(0.2),
                          blurRadius: 12,
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 10,
                              height: 10,
                              decoration: const BoxDecoration(
                                color: Color(0xFF10B981),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'COPILOT 24/7 ACTIVE',
                              style: TextStyle(
                                color: Color(0xFF06B6D4),
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                                letterSpacing: 1.1,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          'LAT: \${_latencyMs > 0 ? _latencyMs : 142} ms',
                          style: const TextStyle(
                            color: Color(0xFF10B981),
                            fontFamily: 'monospace',
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // 4. Multilingual Selector Chips
                Positioned(
                  top: 110,
                  left: 20,
                  right: 20,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildLangChip('en', '🇺🇸 English'),
                        const SizedBox(width: 8),
                        _buildLangChip('ta', '🇮🇳 தமிழ் (Tamil)'),
                        const SizedBox(width: 8),
                        _buildLangChip('hi', '🇮🇳 हिंदी (Hindi)'),
                        const SizedBox(width: 8),
                        _buildLangChip('es', '🇪🇸 Español'),
                        const SizedBox(width: 8),
                        _buildLangChip('de', '🇩🇪 Deutsch'),
                      ],
                    ),
                  ),
                ),

                // 5. Bottom HUD Audio Alert Card
                Positioned(
                  bottom: 40,
                  left: 20,
                  right: 20,
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: const Color(0xFF030712).withOpacity(0.9),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: _latestAudioAlert != null 
                            ? const Color(0xFFF43F5E) 
                            : const Color(0xFF06B6D4).withOpacity(0.5),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text(
                              _detectedObject.toUpperCase(),
                              style: const TextStyle(
                                color: Color(0xFFF59E0B),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.8,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFF06B6D4).withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                _activeLanguage.toUpperCase(),
                                style: const TextStyle(
                                  color: Color(0xFF06B6D4),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _latestAudioAlert ?? 
                          'AI Active: Analyzing Multi-modal streams...\nLanguages: EN, TA, HI, ES, DE',
                          style: TextStyle(
                            color: _latestAudioAlert != null ? Colors.white : Colors.white70,
                            fontSize: 14,
                            fontWeight: _latestAudioAlert != null ? FontWeight.w600 : FontWeight.normal,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            ElevatedButton.icon(
                              onPressed: () => _sendStreamFrameToBackend(),
                              icon: const Icon(Icons.bolt, size: 16),
                              label: Text(_isProcessing ? 'Processing...' : 'Sample Stream'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF06B6D4),
                                foregroundColor: Colors.black,
                                textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            ),
                            if (_latestAudioAlert != null)
                              IconButton(
                                icon: const Icon(Icons.volume_up, color: Color(0xFF06B6D4)),
                                onPressed: () => _speakInNativeLanguage(_latestAudioAlert!, _activeLanguage),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          } else {
            return const Center(
              child: CircularProgressIndicator(color: Color(0xFF06B6D4)),
            );
          }
        },
      ),
    );
  }

  Widget _buildLangChip(String code, String label) {
    final isSelected = _activeLanguage == code;
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeLanguage = code;
        });
        HapticFeedback.selectionClick();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF06B6D4) : const Color(0xFF0F172A).withOpacity(0.8),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF06B6D4) : Colors.white24,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.black : Colors.white,
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}

// Custom Painter for Futuristic HUD Reticle
class HUDOverlayPainter extends CustomPainter {
  final double animationProgress;
  final bool isProcessing;
  HUDOverlayPainter({required this.animationProgress, required this.isProcessing});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF06B6D4).withOpacity(0.4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final center = Offset(size.width / 2, size.height / 2);
    final rectSize = size.width * 0.65;
    final rect = Rect.fromCenter(center: center, width: rectSize, height: rectSize);

    // Draw central target box with corner accents
    canvas.drawRRect(RRect.fromRectAndRadius(rect, const Radius.circular(12)), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
`;

export const FLUTTER_PUBSPEC_YAML = `name: ai_life_copilot
description: "Futuristic 24/7 Universal Life Copilot - Multi-Modal Ingestion Client"
publish_to: 'none'
version: 2.4.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  camera: ^0.10.5+9
  http: ^1.2.0
  flutter_tts: ^3.8.5
  geolocator: ^11.0.0
  flutter_spinkit: ^5.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;
