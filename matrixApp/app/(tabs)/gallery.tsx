import React, { useEffect, useState,useCallback } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native'; 

const ITEM_MARGIN = 10; // Margin between items
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

    // Fetch photos whenever the screen gains focus - this is useful when the user navigates back to the camera screen
    useFocusEffect(
      useCallback(() => {
        loadPhotos();
      }, [])
    );

  useEffect(() => {
    // Fetch photos when the component mounts
    loadPhotos();
  }, []);

  // Load photos from the app memory (FileSystem) and add them to the state
  const loadPhotos = async () => {
    setIsFetching(true);
    try {
      // Get all files from the app memory
      let files:string[]  = [];
      if(FileSystem.documentDirectory){
        files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      }
      // Filter out only the photos
      const photoFiles = files.filter((file) => file.startsWith('photo_'));
      // Create URIs for each photo
      const photoUris = photoFiles.map((file) => `${FileSystem.documentDirectory}${file}`);  
      //ensure that new photos are only added if they are not already in the state.    
      setPhotos((prevPhotos) => {
        const existingPhotosSet = new Set(prevPhotos);//Convert the existing photos state to a Set to efficiently check if a photo already exists.
        const uniquePhotos = photoUris.filter((uri) => !existingPhotosSet.has(uri));
        return [...prevPhotos, ...uniquePhotos];
      });

    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsFetching(false);
    }
  };

   // Upload an image from the phone's gallery
   const uploadPhoto = async () => {
    try {
      // Request permissions to access the gallery
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access gallery is required!');
        return;
      }

      // Open the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        const fileUri = `${FileSystem.documentDirectory}photo_${Date.now()}.jpg`;

        // Save the selected image to app memory
        await FileSystem.copyAsync({
          from: uri,
          to: fileUri,
        });

        // Add the new photo to the state
        setPhotos((prevPhotos) => [fileUri, ...prevPhotos]);
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  const renderPhoto = ({ item }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item }} style={styles.photo} />
    </View>
  );

  return (
    <View style={styles.container}>

        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item}// Use the photo URI as the key
          numColumns={2} // Two photos per row
          contentContainerStyle={styles.list}
          onEndReached={loadPhotos} // Infinite scrolling
          onEndReachedThreshold={0.5} // Load more when 50% scrolled
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No photos yet!</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: ITEM_MARGIN,
    paddingTop: ITEM_MARGIN,
  },
  photoContainer: {
    flex: 1,
    margin: ITEM_MARGIN,
    aspectRatio: 1, // Square items
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#aaa',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
