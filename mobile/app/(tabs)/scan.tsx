import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FONT } from '../../constants/typography';
import { analyzeFood } from '../../services/gemini';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');
  const [analyzing, setAnalyzing] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const requestLock = useRef(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.bg }]}>
        <View style={styles.permBox}>
          <View style={styles.permIconWrap}>
            <MaterialIcons name="camera-alt" size={36} color={Colors.fern} />
          </View>
          <Text style={styles.permTitle}>Camera Access Needed</Text>
          <Text style={styles.permDesc}>
            Bloom Pantry uses your camera to identify and log food items automatically.
          </Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission} activeOpacity={0.85}>
            <Text style={styles.permBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || analyzing || requestLock.current) return;

    requestLock.current = true;
    setAnalyzing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        base64: false,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture photo');
      }

      const result = await analyzeFood(photo.uri);

      router.push({
        pathname: '/confirm',
        params: {
          imageUri: photo.uri,
          data: JSON.stringify(result),
        },
      });
    } catch (e: any) {
      Alert.alert(
        'Scan Failed',
        e?.message ?? 'Could not analyze the image. Please try again.'
      );
    } finally {
      requestLock.current = false;
      setAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Top bar */}
        <SafeAreaView style={styles.topBar}>
          <Text style={styles.topTitle}>Scan Item</Text>
          <Text style={styles.topHint}>Center a food item in the frame</Text>
        </SafeAreaView>

        {/* Viewfinder */}
        <View style={styles.frameWrapper} pointerEvents="none">
          <View style={styles.frame}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            {/* Center crosshair */}
            <View style={styles.crossH} />
            <View style={styles.crossV} />
          </View>
          <Text style={styles.frameLabel}>powering your pantry</Text>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomBar}>
          {analyzing ? (
            <View style={styles.analyzingBox}>
              <View style={styles.analyzingInner}>
                <ActivityIndicator size="small" color={Colors.fern} />
                <Text style={styles.analyzingText}>Analyzing with Gemini…</Text>
              </View>
            </View>
          ) : (
            <View style={styles.captureRow}>
              <View style={styles.captureHint}>
                <Text style={styles.captureHintText}>Tap to capture</Text>
              </View>
              <TouchableOpacity
                style={styles.captureBtn}
                onPress={handleCapture}
                activeOpacity={0.85}
                disabled={analyzing}
              >
                <View style={styles.captureBtnRing}>
                  <View style={styles.captureBtnCore} />
                </View>
              </TouchableOpacity>
              <View style={styles.captureHint} />
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const CORNER = 28;
const THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1A10',
  },
  camera: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: 'rgba(13,26,16,0.65)',
  },
  topTitle: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: FONT,
    letterSpacing: -0.2,
  },
  topHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontFamily: FONT,
    marginTop: 3,
    letterSpacing: 0.1,
  },
  frameWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  frame: {
    width: 264,
    height: 264,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: Colors.fern,
  },
  tl: {
    top: 0, left: 0,
    borderTopWidth: THICKNESS, borderLeftWidth: THICKNESS,
    borderTopLeftRadius: 6,
  },
  tr: {
    top: 0, right: 0,
    borderTopWidth: THICKNESS, borderRightWidth: THICKNESS,
    borderTopRightRadius: 6,
  },
  bl: {
    bottom: 0, left: 0,
    borderBottomWidth: THICKNESS, borderLeftWidth: THICKNESS,
    borderBottomLeftRadius: 6,
  },
  br: {
    bottom: 0, right: 0,
    borderBottomWidth: THICKNESS, borderRightWidth: THICKNESS,
    borderBottomRightRadius: 6,
  },
  crossH: {
    position: 'absolute',
    width: 20,
    height: 1,
    backgroundColor: 'rgba(74,136,112,0.4)',
  },
  crossV: {
    position: 'absolute',
    width: 1,
    height: 20,
    backgroundColor: 'rgba(74,136,112,0.4)',
  },
  frameLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontFamily: FONT,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  bottomBar: {
    paddingBottom: 52,
    paddingTop: 24,
    backgroundColor: 'rgba(13,26,16,0.65)',
    alignItems: 'center',
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  captureHint: {
    flex: 1,
    alignItems: 'center',
  },
  captureHintText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontFamily: FONT,
    letterSpacing: 0.4,
  },
  captureBtn: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnCore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
  },
  analyzingBox: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  analyzingInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  analyzingText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONT,
    letterSpacing: 0.1,
  },
  permBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
    gap: 14,
  },
  permIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.dew,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: FONT,
    color: Colors.text,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  permDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: FONT,
    textAlign: 'center',
    lineHeight: 21,
  },
  permBtn: {
    marginTop: 8,
    backgroundColor: Colors.forest,
    paddingVertical: 15,
    paddingHorizontal: 36,
    borderRadius: 100,
    shadowColor: Colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  permBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontFamily: FONT,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
