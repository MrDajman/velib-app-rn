import MapView, { Marker } from "react-native-maps";
import React, { Image } from "react";
import { View, Text, Button } from "react-native";

const HomeMap = ({ dataInfo, dataStatus, setStationInfo }) => {
  const handleMarkerPress = (station) => {
    console.log("Marker pressed handler");
    setStationInfo(station);
  };

  return (
    <MapView
      className="h-full w-full"
      initialRegion={{
        latitude: 48.894788,
        longitude: 2.4032,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {dataInfo
        ? dataStatus
          ? dataInfo.map((station) => (
              <Marker
                key={station["station_id"]}
                title="Test"
                description="xxx"
                onPress={() => {
                  console.log("Marker pressed!");
                  handleMarkerPress(station);
                }}
                coordinate={{
                  latitude: station["lat"],
                  longitude: station["lon"],
                }}
                icon={
                  dataStatus.find(
                    (item) => item["station_id"] === station["station_id"]
                  )["num_bikes_available_types"][0]["mechanical"] === 0
                    ? require("../assets/icon_red.png")
                    : dataStatus.find(
                        (item) => item["station_id"] === station["station_id"]
                      )["num_bikes_available_types"][0]["mechanical"] < 2
                    ? require("../assets/icon_orange.png")
                    : dataStatus.find(
                        (item) => item["station_id"] === station["station_id"]
                      )["num_bikes_available_types"][0]["mechanical"] < 4
                    ? require("../assets/icon_yellow.png")
                    : require("../assets/icon_green.png")
                }
                anchor={{ x: 0.5, y: 0.5 }}
              ></Marker>
            ))
          : console.log("Loading the Velib' map")
        : console.log("Loading the Velib' map")}
    </MapView>
  );
};

export default HomeMap;
