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
      <SafeAreaView style={styles.container}>
        <View style={styles.permBox}>
          <Text style={styles.permEmoji}>📸</Text>
          <Text style={styles.permTitle}>Camera Access Needed</Text>
          <Text style={styles.permDesc}>
            Bloom Pantry needs your camera to scan food items.
          </Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
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
        <SafeAreaView style={styles.topBar}>
          <Text style={styles.topTitle}>📷 Scan Item</Text>
          <Text style={styles.topHint}>Point at a food or grocery item</Text>
        </SafeAreaView>

        <View style={styles.frameWrapper} pointerEvents="none">
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
        </View>

        <View style={styles.bottomBar}>
          {analyzing ? (
            <View style={styles.analyzingBox}>
              <ActivityIndicator size="large" color={Colors.tealFern} />
              <Text style={styles.analyzingText}>Analyzing with Gemini AI...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={handleCapture}
              activeOpacity={0.8}
              disabled={analyzing}
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepForest,
  },
  camera: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(47,62,70,0.55)',
  },
  topTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  topHint: {
    color: Colors.mist,
    fontSize: 13,
    marginTop: 2,
  },
  frameWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.tealFern,
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 4,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 4,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 4,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 4,
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 48,
    paddingTop: 24,
    backgroundColor: 'rgba(47,62,70,0.55)',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.tealFern,
  },
  captureBtnInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.tealFern,
  },
  analyzingBox: {
    alignItems: 'center',
    gap: 10,
  },
  analyzingText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  permBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
    backgroundColor: Colors.bg,
  },
  permEmoji: {
    fontSize: 52,
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  permDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  permBtn: {
    marginTop: 8,
    backgroundColor: Colors.tealFern,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  permBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import { router } from 'expo-router';
// import { Colors } from '../../constants/colors';
// import { analyzeFood } from '../../services/gemini';

// export default function ScanScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [facing] = useState<CameraType>('back');
//   const [analyzing, setAnalyzing] = useState(false);
//   const cameraRef = useRef<CameraView>(null);

//   // Permission not yet determined
//   if (!permission) {
//     return <View style={styles.container} />;
//   }

//   // Permission denied
//   if (!permission.granted) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.permBox}>
//           <Text style={styles.permEmoji}>📸</Text>
//           <Text style={styles.permTitle}>Camera Access Needed</Text>
//           <Text style={styles.permDesc}>
//             Bloom Pantry needs your camera to scan food items.
//           </Text>
//           <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
//             <Text style={styles.permBtnText}>Grant Permission</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const handleCapture = async () => {
//     if (!cameraRef.current || analyzing) return;
//     setAnalyzing(true);
//     try {
//       const photo = await cameraRef.current.takePictureAsync({ quality: 0.3, base64: false });
//       if (!photo?.uri) throw new Error('Failed to capture photo');

//       const result = await analyzeFood(photo.uri);

//       router.push({
//         pathname: '/confirm',
//         params: {
//           imageUri: photo.uri,
//           data: JSON.stringify(result),
//         },
//       });
//     } catch (e: any) {
//       Alert.alert('Scan Failed', e.message ?? 'Could not analyze the image. Please try again.');
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
//         {/* Top bar */}
//         <SafeAreaView style={styles.topBar}>
//           <Text style={styles.topTitle}>📷 Scan Item</Text>
//           <Text style={styles.topHint}>Point at a food or grocery item</Text>
//         </SafeAreaView>

//         {/* Viewfinder frame */}
//         <View style={styles.frameWrapper} pointerEvents="none">
//           <View style={styles.frame}>
//             <View style={[styles.corner, styles.tl]} />
//             <View style={[styles.corner, styles.tr]} />
//             <View style={[styles.corner, styles.bl]} />
//             <View style={[styles.corner, styles.br]} />
//           </View>
//         </View>

//         {/* Bottom controls */}
//         <View style={styles.bottomBar}>
//           {analyzing ? (
//             <View style={styles.analyzingBox}>
//               <ActivityIndicator size="large" color={Colors.tealFern} />
//               <Text style={styles.analyzingText}>Analyzing with Gemini AI...</Text>
//             </View>
//           ) : (
//             <TouchableOpacity
//               style={styles.captureBtn}
//               onPress={handleCapture}
//               activeOpacity={0.8}
//             >
//               <View style={styles.captureBtnInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const CORNER_SIZE = 24;
// const CORNER_THICKNESS = 3;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.deepForest,
//   },
//   camera: {
//     flex: 1,
//   },
//   topBar: {
//     alignItems: 'center',
//     paddingTop: 16,
//     paddingBottom: 12,
//     backgroundColor: 'rgba(47,62,70,0.55)',
//   },
//   topTitle: {
//     color: Colors.white,
//     fontSize: 18,
//     fontWeight: '700',
//     letterSpacing: -0.3,
//   },
//   topHint: {
//     color: Colors.mist,
//     fontSize: 13,
//     marginTop: 2,
//   },
//   frameWrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   frame: {
//     width: 260,
//     height: 260,
//     position: 'relative',
//   },
//   corner: {
//     position: 'absolute',
//     width: CORNER_SIZE,
//     height: CORNER_SIZE,
//     borderColor: Colors.tealFern,
//   },
//   tl: { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderTopLeftRadius: 4 },
//   tr: { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderTopRightRadius: 4 },
//   bl: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderBottomLeftRadius: 4 },
//   br: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderBottomRightRadius: 4 },
//   bottomBar: {
//     alignItems: 'center',
//     paddingBottom: 48,
//     paddingTop: 24,
//     backgroundColor: 'rgba(47,62,70,0.55)',
//   },
//   captureBtn: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 4,
//     borderColor: Colors.tealFern,
//   },
//   captureBtnInner: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     backgroundColor: Colors.tealFern,
//   },
//   analyzingBox: {
//     alignItems: 'center',
//     gap: 10,
//   },
//   analyzingText: {
//     color: Colors.white,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   permBox: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 32,
//     gap: 12,
//     backgroundColor: Colors.bg,
//   },
//   permEmoji: { fontSize: 52 },
//   permTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
//   permDesc: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
//   permBtn: {
//     marginTop: 8,
//     backgroundColor: Colors.tealFern,
//     paddingVertical: 14,
//     paddingHorizontal: 32,
//     borderRadius: 100,
//   },
//   permBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
// });
