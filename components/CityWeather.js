import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Card, Button } from "react-native-elements";
import { OPEN_WEATHER_API_KEY } from "@env";
import capitalizeFirstLetter from "../utils";
import { addFavorite, removeFavorite } from "../slices/favoritesSlice";
import { colors, globalStyles } from "../styles/theme";
import Photos from "./Photos";
import { useDispatch, useSelector } from "react-redux";

const CityWeather = ({ removeCity, cityName, photos = false }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const favorites = useSelector((state) => state.favorites);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=fr&appid=${OPEN_WEATHER_API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === "404") return;
          setWeather(data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!weather) {
    removeCity(cityName);
    Alert.alert("Erreur", "Ville introuvable.");
    return;
  }

  const isFavorite = favorites.includes(cityName);

  return (
    <Card containerStyle={globalStyles.card}>
      <Card.Title>{cityName}</Card.Title>
      <Card.Divider />

      <View style={styles.infoContainer}>
        <Image
          style={styles.weatherIcon}
          source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png` }}
        />
        <View style={styles.weatherDetails}>
          <Text style={styles.temperature}>{weather.main.temp.toLocaleString("fr-FR")} °C</Text>
          <Text style={styles.description}>{capitalizeFirstLetter(weather.weather[0].description)}</Text>
        </View>
      </View>

      <Button
        title={isFavorite ? "Enlever des favoris" : "Ajouter en favoris"}
        onPress={() => {
          if (isFavorite) {
            dispatch(removeFavorite(cityName));
          } else {
            dispatch(addFavorite(cityName));
          }
        }}
        buttonStyle={{
          ...globalStyles.button,
          backgroundColor: isFavorite ? colors.danger : colors.primary,
        }}
      />

      {photos && (
        <View style={styles.photos}>
          <Photos />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherDetails: {
    flex: 1,
    marginLeft: 10,
  },
  temperature: {
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
  photos: {
    marginTop: 8,
  },
});

export default CityWeather;
