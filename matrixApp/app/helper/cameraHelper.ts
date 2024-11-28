import * as FileSystem from 'expo-file-system';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Alert } from 'react-native';

// Request camera permissions
export const requestCameraPermission = async (permission: any, requestPermission: Function) => {
  if (permission?.status !== 'granted') {
    const response = await requestPermission();
    if (response?.status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is required to use this feature.');
      return false;
    }
  }
  return true;
};

// Toggle camera facing
export const toggleCameraFacing = (currentFacing: CameraType): CameraType => {
  return currentFacing === 'back' ? 'front' : 'back';
};

// Take a picture
export const takePicture = async (
  cameraRef: CameraView | null,
  setPhoto: (uri: string | null) => void,
  setPhotoCount: (count: (prevCount: number) => number) => void,
  cameraDisable: boolean
) => {
  if (cameraDisable) return;

  if (cameraRef) {
    const photo = await cameraRef.takePictureAsync();
    if (photo) {
      setPhoto(photo.uri);

      // Save the photo to app memory
      const fileUri = `${FileSystem.documentDirectory}photo_${Date.now()}.jpg`;
      await FileSystem.copyAsync({
        from: photo.uri,
        to: fileUri,
      });

      setPhotoCount((prevCount) => prevCount + 1);
    }
  }
};
