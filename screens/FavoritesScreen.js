import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import FavoriteCity from "../components/FavoriteCity";
import { globalStyles } from "../styles/theme";
import { useSelector } from "react-redux";
import { Button } from "react-native-elements";

export default function FavoritesScreen({ navigation }) {
  const favorites = useSelector((state) => state.favorites);

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.noFavoritesContainer}>
          <Text style={styles.noFavoritesText}>Aucune ville favorite.</Text>
          <Button
            buttonStyle={globalStyles.button}
            title={"Ajouter un favoris"}
            onPress={() => navigation.navigate("Villes")}
          />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <FavoriteCity cityName={item} />}
          contentContainerStyle={globalStyles.flatList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noFavoritesContainer: {
    marginVertical: "auto",
  },
  noFavoritesText: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
});
