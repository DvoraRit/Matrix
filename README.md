This is a simple Android app built using Expo that allows users to upload and capture photos, store them locally in the app's memory, and display them with infinite scrolling. 
The app also sends periodic push notifications every 10 minutes.

Features
1. **Upload Photos from Gallery:**
    Users can select photos from their device's gallery.
    Photos are saved locally in the app's storage.
    Photos persist across app reloads.

2.**Capture Photos with Camera:**
  Users can take photos using the device's camera.
  Captured photos are saved locally in the app's storage.
  Photos persist across app reloads.
  
3.**Infinite Scrolling:**
  A dedicated gallery screen displays uploaded and captured photos.
  Only two photos are loaded at a time when scrolling down.

4.**Push Notifications:**
  The app sends a "Hello World" push notification every 10 minutes.
  Notifications work even when the app is in the background.

**Setup Instructions**
    Clone the Repository:
      git clone https://github.com/DvoraRit/Matrix.git
      cd matrixApp

    Install Dependencies: Make sure you have npm and Expo CLI installed. Then run:
      yarn install

    Run the App:
      yarn android
    
    Build a Standalone APK (Optional): If you want to generate an APK:
      development - build-android-dev
      prod - build-android-prod

      

    

    
