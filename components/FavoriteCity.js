import React from "react";
import { View } from "react-native";
import CityWeather from "./CityWeather";

const FavoriteCity = ({ cityName }) => {
  return (
    <View>
      <CityWeather cityName={cityName} photos={true} />
    </View>
  );
};

export default FavoriteCity;
