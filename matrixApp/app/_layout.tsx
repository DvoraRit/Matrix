
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCameraPermissions} from 'expo-camera';
 import * as Notifications from 'expo-notifications';
import {View, StyleSheet, Alert } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      //askCameraPermission
      if(permission?.status !== 'granted') {
        requestPermission();
      }
      //ask notif permission
      requestNutificationPermissions();
       // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

    // Request permissions for notifications
    const requestNutificationPermissions = async () => {    
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission required', 'Notifications permissions are required to send alerts.');
          return;
        }
        else{
          scheduleNotification();
        }
      }
      
    };

    // Schedule a notification every 10 minutes
  const scheduleNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear existing notifications (if any)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hello!',
        body: 'This is a reminder every 10 minutes.',
      },
      trigger: {
        seconds: 2 * 60, // 10 minutes in seconds
        repeats: true, // Repeat every 10 minutes
        type: 'timeInterval',
      } as Notifications.TimeIntervalTriggerInput,
    });

    Alert.alert('Notification Scheduled', 'You will receive a "Hello" notification every 10 minutes.');
  };

  return (
    <View style={styles.container}>

    <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
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
});