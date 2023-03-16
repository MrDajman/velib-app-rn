import { View, Text, Button } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import LocationButton from "./LocationButton";

const StatusBar = ({ mapRef, stationInfo, dataStatus, setStart, setEnd }) => {
  // async function handleCenterOnLocation() {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   console.log(status);
  //   if (status !== "granted") {
  //     console.log("Permission to access location was denied");
  //     return;
  //   }

  //   let location = await Location.getCurrentPositionAsync({});
  //   const { latitude, longitude } = location.coords;
  //   mapRef.current.animateToRegion(
  //     {
  //       latitude: latitude,
  //       longitude: longitude,
  //       latitudeDelta: 0.01,
  //       longitudeDelta: 0.01,
  //     },
  //     1000
  //   );
  // }

  const handlePressStart = () => {
    console.log("Pressed set start");
    setStart(stationInfo);
  };

  const handlePressDest = () => {
    console.log("Pressed set start");
    setEnd(stationInfo);
  };

  const searchByKey = (array, key, value) => {
    const result = array.filter((item) => item[key] === value);
    console.log("in searching function");
    return result;
  };

  const renderStationAvailability = (dataStatus, stationInfo) => {
    console.log("in render station availability");
    const singleStation = searchByKey(
      dataStatus,
      "station_id",
      stationInfo["station_id"]
    )[0];

    return (
      "Mechanical bikes available: " +
      singleStation["num_bikes_available_types"][0]["mechanical"] +
      "\n" +
      "Parkings available: " +
      singleStation["num_docks_available"]
    );
  };

  return (
    <View className="absolute h-auto w-auto bottom-0 p-5 items-end">
      <LocationButton mapRef={mapRef} />
      <View className="flex-1 bg-white rounded-lg border-2 border-gray-400 opacity-80">
        <Text className="text-base p-2">
          {stationInfo
            ? stationInfo["name"]
            : "Pick a station to set it as departure or destination"}
        </Text>
        <Text className="text-base p-2">
          {stationInfo
            ? dataStatus
              ? renderStationAvailability(dataStatus, stationInfo)
              : "dataStatus not read yet"
            : "StationInfo not ready"}
        </Text>
        {stationInfo ? (
          <View className="flex-row bg-gray-100 h-12 rounded-lg p-2">
            <View className="bg-green-200 w-1/2 h-full rounded">
              <Button
                onPress={() => {
                  handlePressStart(stationInfo);
                }}
                title="Set as Start"
                color="green"
              />
            </View>
            <View className="bg-red-200 w-1/2 h-full rounded">
              <Button
                onPress={() => {
                  handlePressDest(stationInfo);
                }}
                title="Set as Destination"
                color="red"
              />
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};

export default StatusBar;
