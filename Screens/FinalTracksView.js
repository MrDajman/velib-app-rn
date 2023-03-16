import { View, Text, Linking, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Sharing from "expo-sharing";

import TrackPolyline from "../Components/TrackPolyline";
import apiKeys from "../secretCodes.json";
import LocationButton from "../Components/LocationButton";

const FinalTracksView = ({ navigation, route }) => {
  const { chosenStations, dataInfo, dataStatus } = route.params;

  const [tracksInfo, setTracksInfo] = useState(null);

  const mapRef = useRef(null);

  const handleShareLocation = (coords) => {
    const latitude = coords.split(":")[1]; // replace with your latitude
    const longitude = coords.split(":")[3]; // replace with your longitude

    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Alert.alert("Share location", "Show in google maps?", [
      {
        text: "Go to Google maps",
        onPress: () => Linking.openURL(url),
      },
      { text: "Cancel", onPress: () => console.log("OK Pressed") },
    ]);
    // Linking.openURL(url);
  };

  const getTracks = () => {
    const trackAPIKey = apiKeys["trackAPIKey"];
    const trackPlan = "fastest";
    console.log("in GET TRACKS");
    let listOfTracks = [];
    for (let i = 0; i < chosenStations.length - 1; i++) {
      const firstStationSplit = chosenStations[i].split(":");
      const secondStationSplit = chosenStations[i + 1].split(":");

      const itinerary =
        firstStationSplit[3] +
        "," +
        firstStationSplit[1] +
        "|" +
        secondStationSplit[3] +
        "," +
        secondStationSplit[1];
      console.log(itinerary);
      const trackUrl = `https://www.cyclestreets.net/api/journey.json?key=${trackAPIKey}&reporterrors=1&itinerarypoints=${itinerary}&plan=${trackPlan}`;

      fetch(trackUrl)
        .then((response) => response.json())
        .then((fetchTracksInfo) => {
          listOfTracks = [
            ...listOfTracks,
            fetchTracksInfo["marker"][0]["@attributes"],
          ];

          console.log("in fetch");
          console.log(listOfTracks);

          setTracksInfo(listOfTracks);
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    console.log("Mounted 3nd(useEffect)");

    getTracks();

    return () => {
      console.log("3nd unmounting");
    };
  }, []);

  return (
    <View>
      <MapView
        ref={mapRef}
        className="h-full w-full"
        showsUserLocation={true}
        initialRegion={{
          latitude:
            (parseFloat(chosenStations[0].split(":")[1]) +
              parseFloat(
                chosenStations[chosenStations.length - 1].split(":")[1]
              )) /
            2,
          longitude:
            (parseFloat(chosenStations[0].split(":")[3]) +
              parseFloat(
                chosenStations[chosenStations.length - 1].split(":")[3]
              )) /
            2,
          latitudeDelta:
            Math.abs(
              parseFloat(chosenStations[0].split(":")[1]) -
                parseFloat(
                  chosenStations[chosenStations.length - 1].split(":")[1]
                )
            ) * 1.3,
          longitudeDelta:
            Math.abs(
              parseFloat(chosenStations[0].split(":")[3]) -
                parseFloat(
                  chosenStations[chosenStations.length - 1].split(":")[3]
                )
            ) * 1.3,
        }}
      >
        {tracksInfo ? (
          tracksInfo.map((track, index) => (
            <TrackPolyline key={"track" + String(index)} trackInfo={track} />
          ))
        ) : (
          <View></View>
        )}
        {chosenStations ? (
          chosenStations.map((stationCoords, index) => (
            <Marker
              tracksViewChanges={false}
              opacity={0.5}
              key={"Marker in the Final View" + index}
              onPress={() => handleShareLocation(stationCoords)}
              coordinate={{
                latitude: parseFloat(stationCoords.split(":")[1]),
                longitude: parseFloat(stationCoords.split(":")[3]),
              }}
            ></Marker>
          ))
        ) : (
          <View></View>
        )}
      </MapView>
      {tracksInfo ? (
        <View className="flex-row absolute h-8 w-full bg-green-500"></View>
      ) : (
        <View className="flex-row absolute h-8 w-full bg-red-500"></View>
      )}

      <View className="absolute bottom-0 w-full p-3">
        <View className="items-end">
          <LocationButton mapRef={mapRef} />
        </View>
      </View>
    </View>
  );
};

export default FinalTracksView;
