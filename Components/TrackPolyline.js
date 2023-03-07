import { View, Text } from "react-native";
import React from "react";

import MapView, { Marker, Polyline } from "react-native-maps";

const TrackPolyline = ({ trackInfo }) => {
  const getCoordsFromTrack = (rawCoords) => {
    const coordinates = rawCoords.split(" ").map((coord) => {
      const [longitude, latitude] = coord.split(",");
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    });
    return coordinates;
  };

  return (
    <View>
      <Polyline
        strokeWidth={5}
        coordinates={
          trackInfo
            ? getCoordsFromTrack(trackInfo["coordinates"])
            : [
                { latitude: 37.8025259, longitude: -122.4351431 },
                { latitude: 37.7896386, longitude: -122.421646 },
              ]
        }
      />
    </View>
  );
};

export default TrackPolyline;
