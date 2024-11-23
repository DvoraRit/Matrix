import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';

const ITEM_MARGIN = 10; // Margin between items
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Fetch photos when the component mounts
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setIsFetching(true);
    try {
      // Get all files from the app memory
      let files:string[]  = [];
      if(FileSystem.documentDirectory){
        files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      }
    else{
        console.log("No files found")
    }

      // Filter photos (optional: based on a naming convention, e.g., photo_)
      const photoFiles = files.filter((file) => file.startsWith('photo_'));

      // Create URIs for each photo
      const photoUris = photoFiles.map((file) => `${FileSystem.documentDirectory}${file}`);

      setPhotos((prevPhotos) => [...prevPhotos, ...photoUris]);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const renderPhoto = ({ item }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item }} style={styles.photo} />
    </View>
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderPhoto}
      keyExtractor={(item, index) => index.toString()}
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
  );
}

const styles = StyleSheet.create({
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
});
