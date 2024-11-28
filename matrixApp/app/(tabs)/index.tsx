

import { CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { requestCameraPermission, toggleCameraFacing, takePicture } from './helpers/cameraHelper';
 
export default function HomeScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraDisable, setCameraDisable] = useState(false);
  const [photoCount, setPhotoCount] = useState(0); // Counter state for the number of photos taken

  useEffect(() => {
    const initCamera = async () => {
      const granted = await requestCameraPermission(permission, requestPermission);
      if (!granted) {
        setCameraDisable(true);
      }
    };
    initCamera();
  }, [permission]);


  return (
    <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} 
        animateShutter={true}
        ref={(ref) => setCameraRef(ref)}
        >
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}  
            onPress={() => setFacing(toggleCameraFacing(facing))}>
            <Text style={styles.text}>Switch Camera Facing</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => takePicture(cameraRef, setPhoto, setPhotoCount, cameraDisable)}
            >
            <Text style={styles.buttonText}>Take Picture</Text>
          </TouchableOpacity>           
          <Text style={styles.text}>Num of photos taken: {photoCount}</Text>
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
    position: 'absolute', // Keep the container fixed at the bottom
    bottom: 20,           // Position from the bottom
    left: 20,
    right: 20,
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'center', // Center items vertically in the container
    alignItems: 'center',    // Center items horizontally
    gap: 15,  
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',           // Stretch the button to full container width
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

});
