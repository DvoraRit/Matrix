
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
import * as FileSystem from 'expo-file-system';

export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [animatedOpacity] = useState(new Animated.Value(0));
  const [cameraDisable, setCameraDisable] = useState(false);
  const [showFlashAnimationOpacity, setShowFlashAnimationOpacity] = useState(false);
  const [photoCount, setPhotoCount] = useState(0); // Counter state for the number of photos taken

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
      
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      if(photo){
        console.log(photo.uri);
        setPhoto(photo.uri);
        //save photo to gallery
          // Save the photo to app memory
          const fileUri = `${FileSystem.documentDirectory}photo_${Date.now()}.jpg`;
          await FileSystem.copyAsync({
            from: photo.uri,
            to: fileUri,
          });
          console.log('Photo saved at:', fileUri);
          setPhotoCount((prevCount) => prevCount + 1);
          setCameraDisable(false); // Re-enable camera

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
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
          <Text style={styles.text}>Num of photos taken: {photoCount}
            
          </Text>
        </View>
      </CameraView>
    </View>
   
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
