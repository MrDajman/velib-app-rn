import { View, Text } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";

const LocationButton = ({ mapRef }) => {
  async function handleCenterOnLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log(status);
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    mapRef.current.animateToRegion(
      {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  }

  return (
    <View>
      <TouchableOpacity
        className="items-end h-auto w-auto bg-white flex-shrink rounded-lg opacity-60"
        onPress={handleCenterOnLocation}
      >
        <Ionicons name="md-locate" size={64} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default LocationButton;
