import { View, Text } from "react-native";
import React from "react";

import MapView, { Marker, Polyline } from "react-native-maps";

const StartEndMarkers = ({ startPoint, endPoint }) => {
  return (
    <View>
      <Marker
        key={startPoint["station_id"]}
        title="Departure point"
        description={startPoint["name"]}
        coordinate={{
          latitude: startPoint["lat"],
          longitude: startPoint["lon"],
        }}
      ></Marker>
      <Marker
        key={endPoint["station_id"]}
        title="Destination point"
        description={endPoint["name"]}
        coordinate={{
          latitude: endPoint["lat"],
          longitude: endPoint["lon"],
        }}
      ></Marker>
    </View>
  );
};

export default StartEndMarkers;
