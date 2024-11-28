import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

const TRIGGET_INTERVAL = 10 * 60; // 10 minutes in seconds

// Request permissions for notifications
export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      Alert.alert('Permission required', 'Notifications permissions are required to send alerts.');
      return false;
    }
  }
  await scheduleNotification();
  return true;
};

// Schedule a notification every 10 minutes
export const scheduleNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync(); // Clear existing notifications (if any)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hello!',
      body: 'This is a reminder every 10 minutes.',
    },
    trigger: {
      seconds: TRIGGET_INTERVAL, // 10 minutes in seconds
      repeats: true, // Repeat every 10 minutes
    } as Notifications.TimeIntervalTriggerInput,
  });

  Alert.alert('Notification Scheduled', 'You will receive a "Hello" notification every 10 minutes.');
};
