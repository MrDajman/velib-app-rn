import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

import MainView from "./Screens/MainView";
import TrackView from "./Screens/TrackView";
import FinalTracksView from "./Screens/FinalTracksView";

const Stack = createStackNavigator();

export default function App() {
  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    console.log("in the App");
    console.log(latitude, longitude);
  }

  getCurrentLocation();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainView">
        <Stack.Screen name="MainView" component={MainView} />
        <Stack.Screen name="TrackView" component={TrackView} />
        <Stack.Screen name="FinalTracksView" component={FinalTracksView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
