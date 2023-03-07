import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

import StartEndMarkers from "../Components/StartEndMarkers";
import TrackPolyline from "../Components/TrackPolyline";
import ChangeMarkers from "../Components/ChangeMarkers";
import SelectiveStationsMarkers from "../Components/SelectiveStationsMarkers";

import apiKeys from "../secretCodes.json";

const TrackView = ({ navigation, route }) => {
  const { startPoint, endPoint, dataInfo, dataStatus } = route.params;

  const [trackInfo, setTrackInfo] = useState(null);
  const [countPoints, setCountPoints] = useState(0);
  const [chosenStations, setChosenStations] = useState([]);

  const getTrack = () => {
    console.log("in get Track");
    const trackAPIKey = apiKeys["trackAPIKey"];
    const trackPlan = "fastest";
    const itinerary =
      String(startPoint["lon"]) +
      "," +
      String(startPoint["lat"]) +
      "|" +
      String(endPoint["lon"]) +
      "," +
      String(endPoint["lat"]);

    const trackUrl = `https://www.cyclestreets.net/api/journey.json?key=${trackAPIKey}&reporterrors=1&itinerarypoints=${itinerary}&plan=${trackPlan}`;
    //0.11795,52.20530,City+Centre|0.13140,52.22105,Mulberry+Close|0.14732,52.19965,Thoday+Street

    fetch(trackUrl)
      .then((response) => response.json())
      .then((trackInfo) => {
        setTrackInfo(trackInfo["marker"][0]["@attributes"]);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    console.log("Mounted 2rd(useEffect)");

    getTrack();

    return () => {
      console.log("2rd unmounting");
    };
  }, []);

  function countElementsForTargetSum(list, target) {
    let sum = 0;
    for (let i = 0; i < list.length; i++) {
      sum += list[i];
      if (sum >= target) {
        return i;
      }
    }
    return list.length;
  }
  const getNbOfLegs = () => {
    const timePerLeg = 25 * 60;
    const nbOfLegs = Math.ceil(trackInfo["time"] / timePerLeg);
    return nbOfLegs;
  };

  const getChangingPoints = (rawCoords) => {
    // calculating nb of legs and location of points

    const nbOfLegs = getNbOfLegs();
    const distancesList = trackInfo["distances"].split(",").map(Number);
    const changingPoints = [];
    // Calculating change point(s)
    if (nbOfLegs - 1) {
      const sumDistances = distancesList.reduce(
        (partialSum, a) => partialSum + a,
        0
      );

      const singleLegDistance = sumDistances / nbOfLegs;

      for (let i = 0; i < nbOfLegs - 1; i++) {
        let target = (i + 1) * singleLegDistance;
        const indexChange = countElementsForTargetSum(distancesList, target);
        changingPoints.push(rawCoords.split(" ")[indexChange]);
      }
    } else {
    }

    const changingPointsCoords = changingPoints.map((coord) => {
      const [longitude, latitude] = coord.split(",");
      return {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
    });

    updateChosenPoints(changingPointsCoords);

    return changingPointsCoords;
  };

  const updateChosenPoints = (changingPointsCoords) => {
    let newChosenStations = chosenStations;

    if (!newChosenStations[0]) {
      newChosenStations[0] = String(
        "lat:" + startPoint["lat"] + ":lon:" + startPoint["lon"]
      );
    } else {
    }

    for (let i = 1; i <= changingPointsCoords.length; i++) {
      if (!newChosenStations[i]) {
        newChosenStations[i] = String("Undefined");
      } else {
      }
    }

    if (!newChosenStations[changingPointsCoords.length + 1]) {
      newChosenStations[changingPointsCoords.length + 1] = String(
        "lat:" + endPoint["lat"] + ":lon:" + endPoint["lon"]
      );
    } else {
    }
  };

  const getAllInterestPoints = (coord) => {
    let allInterestPointsTemp = getChangingPoints(coord);
    allInterestPointsTemp.unshift({
      latitude: startPoint["lat"],
      longitude: startPoint["lon"],
    });
    allInterestPointsTemp.push({
      latitude: endPoint["lat"],
      longitude: endPoint["lon"],
    });

    return allInterestPointsTemp;
  };

  const handleToggleViewButton = (point, coord, countPoints) => {
    const points = getAllInterestPoints(coord);
    mapRef.current.animateToRegion(
      {
        latitude: points[countPoints].latitude,
        longitude: points[countPoints].longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      1000
    );
    countPoints == points.length - 1
      ? setCountPoints(0)
      : setCountPoints(countPoints + 1);
  };
  const mapRef = useRef(null);

  const handleGoButton = () => {
    console.log("Pressed GOOO!");
    navigation.navigate("FinalTracksView", {
      chosenStations: chosenStations,
      dataInfo: dataInfo,
      dataStatus: dataStatus,
    });
  };

  return (
    <View>
      <MapView
        ref={mapRef}
        className="h-full w-full"
        initialRegion={{
          latitude: (startPoint["lat"] + endPoint["lat"]) / 2,
          longitude: (startPoint["lon"] + endPoint["lon"]) / 2,
          latitudeDelta: Math.abs(startPoint["lat"] - endPoint["lat"]) * 1.2,
          longitudeDelta: Math.abs(startPoint["lon"] - endPoint["lon"]) * 1.2,
        }}
      >
        <StartEndMarkers startPoint={startPoint} endPoint={endPoint} />
        <TrackPolyline trackInfo={trackInfo} />
        <ChangeMarkers
          trackInfo={trackInfo}
          getChangingPoints={getChangingPoints}
        />
        {trackInfo ? (
          <View>
            <SelectiveStationsMarkers
              key="SelectiveStart"
              dataInfo={dataInfo}
              dataStatus={dataStatus}
              point={{
                latitude: startPoint["lat"],
                longitude: startPoint["lon"],
              }}
              order={0}
              setStationsFunc={setChosenStations}
              chosenStations={chosenStations}
            />
            <SelectiveStationsMarkers
              dataInfo={dataInfo}
              key="SelectiveEnd"
              dataStatus={dataStatus}
              point={{
                latitude: endPoint["lat"],
                longitude: endPoint["lon"],
              }}
              order={getNbOfLegs()}
              setStationsFunc={setChosenStations}
              chosenStations={chosenStations}
            />

            {trackInfo
              ? getChangingPoints(trackInfo["coordinates"]).map(
                  (singleChangingPoint, index) => (
                    <SelectiveStationsMarkers
                      key={"SelectiveMid" + index}
                      dataInfo={dataInfo}
                      dataStatus={dataStatus}
                      point={singleChangingPoint}
                      order={index + 1}
                      setStationsFunc={setChosenStations}
                      chosenStations={chosenStations}
                    />
                  )
                )
              : console.log("Waiting to load the track")}
          </View>
        ) : (
          <View></View>
        )}
      </MapView>

      <View className="flex-row absolute h-auto w-full bg-green-100">
        <View className="h-auto w-128 bg-red-400">
          <Text>
            {trackInfo
              ? "Distance: " + trackInfo["length"] / 1000 + " km"
              : "Loading the track..."}
          </Text>
          <Text>
            {trackInfo
              ? "Estimated time: " +
                Math.floor(trackInfo["time"] / 60) +
                " min " +
                Math.round(
                  (trackInfo["time"] / 60 -
                    Math.floor(trackInfo["time"] / 60)) *
                    60
                ) +
                " s"
              : "Loading the track..."}
          </Text>
          {chosenStations ? (
            chosenStations.map((station, index) => (
              <Text>{chosenStations[index]}</Text>
            ))
          ) : (
            <Text></Text>
          )}
        </View>
        <TouchableOpacity
          className="bg-blue-300 w-full h-full"
          onPress={handleGoButton}
        >
          <Text>GO!</Text>
        </TouchableOpacity>
      </View>

      {trackInfo ? (
        <View className="flex-row absolute h-32 w-full bg-red-200 bottom-0">
          <TouchableOpacity
            className="h-32 w-1/3 bg-red-400"
            onPress={() =>
              handleToggleViewButton(
                endPoint,
                trackInfo["coordinates"],
                countPoints
              )
            }
          >
            <Text>Toggle View</Text>
          </TouchableOpacity>
          <TouchableOpacity className="h-32 w-1/3 bg-blue-200" />
          <TouchableOpacity className="h-32 w-1/3 bg-green-200" />
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default TrackView;
