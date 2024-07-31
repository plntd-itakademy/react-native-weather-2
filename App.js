import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import CitySelectorScreen from "./screens/CitySelectorScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import { colors } from "./styles/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Provider } from "react-redux";
import { store } from "./store";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: "grey",
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case "Villes":
                  iconName = focused ? "list" : "list-outline";
                  break;
                case "Favoris":
                  iconName = focused ? "heart" : "heart-outline";
                  break;
                default:
                  iconName = focused ? "home" : "home-outline";
                  break;
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Accueil" component={HomeScreen} />
          <Tab.Screen name="Villes" component={CitySelectorScreen} />
          <Tab.Screen name="Favoris" component={FavoritesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
