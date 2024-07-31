import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { FlatList, Image, StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";
import { globalStyles } from "../styles/theme";

export default function Photos() {
  const [photos, setPhotos] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      if (typeof result?.assets[0] === "undefined") return;
      setPhotos((prevState) => [...prevState, result.assets[0].uri]);
    }
  };

  return (
    <>
      <Button title={"Ajouter une photo"} onPress={pickImage} buttonStyle={globalStyles.button} />
      <FlatList
        data={photos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.photo} />}
        horizontal={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 8,
  },
});
