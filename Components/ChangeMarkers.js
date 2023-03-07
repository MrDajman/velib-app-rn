import { View, Text } from "react-native";
import React from "react";

import MapView, { Marker, Polyline } from "react-native-maps";

const ChangeMarkers = ({ trackInfo, getChangingPoints }) => {
  return (
    <View>
      {trackInfo
        ? getChangingPoints(trackInfo["coordinates"]).map(
            (singleChangingPoint) => (
              <Marker
                key={"change" + String(singleChangingPoint["latitude"])}
                title="Test"
                description="xxx"
                coordinate={singleChangingPoint}
              ></Marker>
            )
          )
        : ""}
    </View>
  );
};

export default ChangeMarkers;
