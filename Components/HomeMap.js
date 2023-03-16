import MapView, { Marker, Callout, CalloutSubview } from "react-native-maps";
import React, { Image, useRef } from "react";
import { View, Text, Button, Touchable, TouchableOpacity } from "react-native";

const HomeMap = ({ mapRef, dataInfo, dataStatus, setStationInfo }) => {
  const handleMarkerPress = (station) => {
    console.log("Marker pressed handler");
    setStationInfo(station);
  };

  const handleCalloutPress = () => {
    // Handle button press event here
    console.log("TO Pressed");
  };

  return (
    <MapView
      ref={mapRef}
      className="h-full w-full"
      initialRegion={{
        latitude: 48.894788,
        longitude: 2.4032,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
    >
      {dataInfo
        ? dataStatus
          ? dataInfo.map((station, index) => (
              <View key={"station_base" + index}>
                <Marker
                  key={station["station_id"]}
                  onPress={() => {
                    console.log("Marker pressed!");
                    handleMarkerPress(station);
                  }}
                  coordinate={{
                    latitude: station["lat"],
                    longitude: station["lon"],
                  }}
                  image={
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
                <Marker
                  key={station["station_id"] + "_outer"}
                  onPress={() => {
                    handleMarkerPress(station);
                  }}
                  coordinate={{
                    latitude: station["lat"],
                    longitude: station["lon"],
                  }}
                  image={
                    dataStatus.find(
                      (item) => item["station_id"] === station["station_id"]
                    )["num_docks_available"] === 0
                      ? require("../assets/icon_red_out.png")
                      : dataStatus.find(
                          (item) => item["station_id"] === station["station_id"]
                        )["num_docks_available"] < 2
                      ? require("../assets/icon_orange_out.png")
                      : dataStatus.find(
                          (item) => item["station_id"] === station["station_id"]
                        )["num_docks_available"] < 4
                      ? require("../assets/icon_yellow_out.png")
                      : require("../assets/icon_green_out.png")
                  }
                  anchor={{ x: 0.5, y: 0.5 }}
                ></Marker>
              </View>
            ))
          : console.log("Loading the Velib' map")
        : console.log("Loading the Velib' map")}
    </MapView>
  );
};

export default HomeMap;
