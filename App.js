import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ActivityIndicator, Button, FlatList, Alert } from "react-native";
import { OPEN_WEATHER_API_KEY } from "@env";
import * as Location from "expo-location";
import capitalizeFirstLetter from "./utils";
import Photos from "./components/Photos";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (lat, lon) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${OPEN_WEATHER_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);

        if (data?.cod === 401) {
          Alert.alert("Erreur", "Clé API invalide.");
          return;
        }

        setWeather(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Chargement en cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weather ? (
        <>
          <Text style={styles.title}>Météo à {weather.name}</Text>
          <Text style={styles.temperature}>{weather.main.temp.toLocaleString("fr-FR")} °C</Text>
          <Text>{capitalizeFirstLetter(weather.weather[0].description)}</Text>
          <Image
            style={styles.weatherIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`,
            }}
          />

          <Photos />
        </>
      ) : (
        <Text>Impossible de récupérer les données météo.</Text>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  temperature: {
    fontSize: 24,
    marginVertical: 10,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
});
