import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import 'react-native-reanimated';
import messaging from '@react-native-firebase/messaging';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  useEffect(() => {
    requestUserPermission();
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }

  const getFcmToken = async () => {
    let fcmtoken = await messaging().getToken();
    if (fcmtoken) {
      console.log(fcmtoken);
    } else {
      console.log("Failed to generate the FCM token")
    }
  }
  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  const displayNotification = async (remoteMessage: messaging.RemoteMessage) => {
    let notificationTitle = 'New Notification';
    let notificationBody = 'You have a new message';
    if (remoteMessage.notification) {
      notificationTitle = remoteMessage.notification.title || notificationTitle;
      notificationBody = remoteMessage.notification.body || notificationBody;
    } else if (remoteMessage.data) {
      notificationTitle = (remoteMessage.data as any).title || notificationTitle;
      notificationBody = (remoteMessage.data as any).body || notificationBody;
    }

    // For Android, you might need to use a local notification library to display the notification
    // as the app is in the background or quit state.
    if (Platform.OS === 'android') {
      // Example using a hypothetical local notification library (replace with your actual library)
      //   await LocalNotifications.display({
      //     title: notificationTitle,
      //     body: notificationBody,
      //   });
        console.log("Notification for Android (in background):", notificationTitle, notificationBody)
        Alert.alert(notificationTitle, notificationBody)
    } else {
      // For iOS, this might be enough to display a notification
      Alert.alert(notificationTitle, notificationBody);
    }
  };

  useEffect(() => {
    // Check if the app was opened from a notification when in the background or quit state
    const unsubscribe = messaging().onNotificationOpenedApp(
      async (remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        displayNotification(remoteMessage);
      }
    );

    return unsubscribe;
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
