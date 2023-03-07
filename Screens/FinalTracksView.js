import { View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useState, useEffect, useRef, useCallback } from "react";

import TrackPolyline from "../Components/TrackPolyline";

import apiKeys from "../secretCodes.json";

const FinalTracksView = ({ navigation, route }) => {
  const { chosenStations, dataInfo, dataStatus } = route.params;

  const [tracksInfo, setTracksInfo] = useState(null);

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

    // console.log(tracksInfo);

    // const trackUrl = `https://www.cyclestreets.net/api/journey.json?key=${trackAPIKey}&reporterrors=1&itinerarypoints=${itinerary}&plan=${trackPlan}`;
    //0.11795,52.20530,City+Centre|0.13140,52.22105,Mulberry+Close|0.14732,52.19965,Thoday+Street

    // fetch(trackUrl)
    //   .then((response) => response.json())
    //   .then((trackInfo) => {
    //     setTrackInfo(trackInfo["marker"][0]["@attributes"]);
    //   })
    //   .catch((error) => console.error(error));
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
        className="h-full w-full"
        initialRegion={{
          latitude: 48.88179064200294,
          longitude: 2.4030599377642674,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {tracksInfo ? (
          tracksInfo.map((track, index) => <TrackPolyline trackInfo={track} />)
        ) : (
          <View></View>
        )}
      </MapView>
      {tracksInfo ? (
        <View className="flex-row absolute h-8 w-full bg-green-500"></View>
      ) : (
        <View className="flex-row absolute h-8 w-full bg-red-500"></View>
      )}
    </View>
  );
};

export default FinalTracksView;
