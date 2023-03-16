import { View, Text, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import React, { useState, useEffect, useRef, useReducer } from "react";

import StartEndMarkers from "../Components/StartEndMarkers";
import TrackPolyline from "../Components/TrackPolyline";
import ChangeMarkers from "../Components/ChangeMarkers";
import SelectiveStationsMarkers from "../Components/SelectiveStationsMarkers";

import apiKeys from "../secretCodes.json";
import LocationButton from "../Components/LocationButton";

const TrackView = ({ navigation, route }) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const { startPoint, endPoint, dataInfo, dataStatus } = route.params;

  const [trackInfo, setTrackInfo] = useState(null);
  const [countPoints, setCountPoints] = useState(0);
  const [chosenStations, setChosenStations] = useState([]);

  const handleSetChosenStations = (newChosenStations) => {
    setChosenStations(newChosenStations);
  };

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

  const handleChangeViewButtons = (coord, viewNb) => {
    const points = getAllInterestPoints(coord);
    mapRef.current.animateToRegion(
      {
        latitude: points[viewNb].latitude,
        longitude: points[viewNb].longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      1200
    );
  };

  const mapRef = useRef(null);

  const getAllStationsChosen = () => {
    // check if all stations picked
    let stationsPicked = true;
    for (let i = 0; i < chosenStations.length; i++) {
      if (chosenStations[i] === "Undefined") {
        stationsPicked = false;
      }
    }
    return stationsPicked;
  };

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
          latitudeDelta: Math.abs(startPoint["lat"] - endPoint["lat"]) * 1.3,
          longitudeDelta: Math.abs(startPoint["lon"] - endPoint["lon"]) * 1.3,
        }}
        showsUserLocation={true}
      >
        <StartEndMarkers startPoint={startPoint} endPoint={endPoint} />
        <TrackPolyline trackInfo={trackInfo} />
        <ChangeMarkers
          trackInfo={trackInfo}
          getChangingPoints={getChangingPoints}
        />
        {trackInfo ? (
          <SelectiveStationsMarkers
            key="SelectiveStart"
            dataInfo={dataInfo}
            dataStatus={dataStatus}
            point={{
              latitude: startPoint["lat"],
              longitude: startPoint["lon"],
            }}
            order={0}
            setStationsFunc={handleSetChosenStations}
            chosenStations={chosenStations}
            forceUpdate={forceUpdate}
          />
        ) : (
          console.log("Waiting to load the track")
        )}
        {trackInfo ? (
          <SelectiveStationsMarkers
            dataInfo={dataInfo}
            key="SelectiveEnd"
            dataStatus={dataStatus}
            point={{
              latitude: endPoint["lat"],
              longitude: endPoint["lon"],
            }}
            order={getNbOfLegs()}
            setStationsFunc={handleSetChosenStations}
            chosenStations={chosenStations}
            forceUpdate={forceUpdate}
          />
        ) : (
          console.log("Waiting to load the track")
        )}

        {trackInfo
          ? getChangingPoints(trackInfo["coordinates"]).map(
              (singleChangingPoint, index) => (
                <SelectiveStationsMarkers
                  key={"SelectiveMid" + index.toString()}
                  dataInfo={dataInfo}
                  dataStatus={dataStatus}
                  point={singleChangingPoint}
                  order={index + 1}
                  setStationsFunc={handleSetChosenStations}
                  chosenStations={chosenStations}
                  forceUpdate={forceUpdate}
                />
              )
            )
          : console.log("Waiting to load the track")}
      </MapView>

      <View className=" absolute h-auto w-full bottom-0 items-end p-1">
        <LocationButton mapRef={mapRef} />
        <View className="flex-1 w-full items-center bg-white rounded-lg border-2 border-gray-400 opacity-80">
          <View className="h-auto w-128  align-center items-center justify-center">
            <Text className="text-base">
              {trackInfo
                ? "Initial distance: " + trackInfo["length"] / 1000 + " km"
                : "Loading the track..."}
            </Text>
            <Text className="text-base">
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
            <Text className="text-base">Pick the bike changing stations:</Text>
            <Text className="text-xs text-center text-slate-500">
              {
                "(Click red bubble -> press station circle\nand press button Pick this station)"
              }
            </Text>
          </View>
          <View className="flex-row p-2">
            {chosenStations ? (
              chosenStations.map((station, index) =>
                index > 0 && index < chosenStations.length - 1 ? (
                  // <Text key={index}>{chosenStations[index]}</Text>
                  <TouchableOpacity
                    key={"TO_choice_" + index}
                    className={
                      "h-16 w-12 flex-grow rounded-full " +
                      (station === "Undefined" ? "bg-red-300" : "bg-green-400")
                    }
                    onPress={() =>
                      handleChangeViewButtons(trackInfo["coordinates"], index)
                    }
                  ></TouchableOpacity>
                ) : (
                  <View key={"empty_view_choice_" + index}></View>
                )
              )
            ) : (
              <Text></Text>
            )}
          </View>
          <View className="p-2 flex-row">
            <TouchableOpacity
              className="bg-blue-500 h-16 w-64 items-center align-center justify-center rounded-full"
              onPress={forceUpdate}
            >
              <Text className="text-white">Pick this station!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                "h-16 w-24 items-center align-center justify-center rounded-full " +
                (getAllStationsChosen() ? "bg-green-500" : "bg-slate-500")
              }
              onPress={handleGoButton}
              disabled={!getAllStationsChosen()}
            >
              <Text>Go!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrackView;
