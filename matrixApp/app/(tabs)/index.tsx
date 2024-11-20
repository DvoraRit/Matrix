
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CameraView, CameraType, useCameraPermissions, Camera
  , CameraCapturedPicture,
  CameraViewRef
 } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Animated } from 'react-native';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [animatedOpacity] = useState(new Animated.Value(0));
  const [cameraDisable, setCameraDisable] = useState(false);
  const [showFlashAnimationOpacity, setShowFlashAnimationOpacity] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  function requestCameraPermission() {
    if (permission?.status !== 'granted') {
      return (
        <View style={styles.container}>
          <ThemedText style={styles.message}>
            Camera permission is required to use this screen
          </ThemedText>
          <TouchableOpacity onPress={requestPermission}>
            <ThemedText style={styles.message}>Request Permission</ThemedText>
          </TouchableOpacity>
        </View>
      );
    }
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function flashAnimation() {
    Animated.timing(animatedOpacity, {
      useNativeDriver: false,
      toValue: 1,
      duration: 0,
    }).start(() => {
      Animated.timing(animatedOpacity, {
        useNativeDriver: false,
        toValue: 0,
        duration: 2000,
      }).start();
    });
  }

  const takePicture = async () => {
    if (cameraDisable) return;
    //disable camera and show flash animation
    setShowFlashAnimationOpacity(true);
    setCameraDisable(true);
    flashAnimation();
    // this.setState(
    //   {cameraDisable: true, showFlashAnimationOpacity: true},
    //   () => this.flashAnimation())
      
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      if(photo){
        console.log(photo.uri);
        setPhoto(photo.uri);
        //save photo to gallery
        // CameraRoll.save(photo.uri, { type: 'photo', album: 'expo-camera' });

      }
    }
  };


  return (
    <View style={styles.container}>

        <CameraView style={styles.camera} facing={facing} 
        animateShutter={true}
        ref={(ref) => setCameraRef(ref)}
        >
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Welcome!</ThemedText>
    //     <HelloWave />
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
    //     <ThemedText>
    //       Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
    //       Press{' '}
    //       <ThemedText type="defaultSemiBold">
    //         {Platform.select({
    //           ios: 'cmd + d',
    //           android: 'cmd + m',
    //           web: 'F12'
    //         })}
    //       </ThemedText>{' '}
    //       to open developer tools.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
    //     <ThemedText>
    //       Tap the Explore tab to learn more about what's included in this starter app.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
    //     <ThemedText>
    //       When you're ready, run{' '}
    //       <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
    //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
    //     </ThemedText>
    //   </ThemedView>
    // </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  ///////////
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
