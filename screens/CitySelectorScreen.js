import React, { useState } from "react";
import { StyleSheet, View, TextInput, FlatList, Text, Keyboard } from "react-native";
import { Button } from "react-native-elements";
import CityWeather from "../components/CityWeather";
import capitalizeFirstLetter from "../utils";
import { globalStyles } from "../styles/theme";

export default function CitySelectorScreen() {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");

  const addCity = () => {
    const cityNameFormatted = capitalizeFirstLetter(cityName.trim());

    if (!cityNameFormatted) {
      setError("Le nom de la ville ne peut pas être vide.");
      return;
    }

    if (cities.includes(cityNameFormatted)) {
      setError("Cette ville a déjà été ajoutée.");
      return;
    }

    setError("");

    setCities((prevCities) => [cityNameFormatted, ...prevCities]);
    setCityName("");
    Keyboard.dismiss();
  };

  const removeCity = (cityName) => {
    setCities(cities.filter((city) => city !== cityName));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={globalStyles.input}
        placeholder="Entrez le nom d'une ville"
        value={cityName}
        onChangeText={setCityName}
        onSubmitEditing={addCity}
      />
      {error && <Text style={globalStyles.errorText}>{error}</Text>}
      <Button title="Ajouter une ville" onPress={addCity} buttonStyle={[globalStyles.button, styles.button]} />

      <FlatList
        data={cities}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <CityWeather removeCity={removeCity} cityName={item} />}
        contentContainerStyle={globalStyles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 10,
  },
});
