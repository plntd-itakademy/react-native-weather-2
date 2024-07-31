import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Button, FlatList, Image, StyleSheet, View } from "react-native";

export default function Photos() {
  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (typeof result?.assets[0] === "undefined") return;
      setPhotos((prevState) => [...prevState, result.assets[0].uri]);
    }
  };

  return (
    <>
      <Button title="Sélectionnez une photo" onPress={pickImage} />
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.photo} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: 200,
    height: 200,
    margin: 10,
  },
});
