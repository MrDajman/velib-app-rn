import { View, Text, Button } from "react-native";
import React from "react";

const StatusBar = ({ stationInfo, dataStatus, setStart, setEnd }) => {
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
      "Mechanical bikes available " +
      singleStation["num_bikes_available_types"][0]["mechanical"]
    );
  };

  return (
    <View className="absolute h-auto w-full bottom-0 p-5">
      <View className="flex-1 bg-blue-500 rounded-lg">
        <Text>{stationInfo ? stationInfo["name"] : "Damian"}</Text>
        <Text>
          {stationInfo
            ? dataStatus
              ? renderStationAvailability(dataStatus, stationInfo)
              : "dataStatus not read yet"
            : "StationInfo not ready"}
        </Text>
        <View className="flex-row bg-blue-200 h-12 rounded-lg p-2">
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
      </View>
    </View>
  );
};

export default StatusBar;
