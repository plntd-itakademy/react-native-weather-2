import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, ActivityIndicator, Alert } from "react-native";
import { Card, Text } from "react-native-elements";
import * as Location from "expo-location";
import { OPEN_WEATHER_API_KEY } from "@env";
import capitalizeFirstLetter from "../utils";
import Photos from "../components/Photos";
import { colors, globalStyles } from "../styles/theme";

export default function HomeScreen() {
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
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${OPEN_WEATHER_API_KEY}`
      );
      const data = await response.json();

      if (data?.cod === 401) {
        Alert.alert("Erreur", "Clé API invalide.");
        return;
      }

      setWeather(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color={colors.primary} />
        <Text style={styles.loadingText}>Chargement en cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weather ? (
        <Card containerStyle={[globalStyles.card, styles.card]}>
          <Text style={styles.title}>{weather.name}</Text>

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

          <Photos />
        </Card>
      ) : (
        <Text>Impossible de récupérer les données météo.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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

  loadingText: {
    marginTop: 10,
  },
});
