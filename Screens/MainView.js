import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import MapView, {
  Polyline,
  Circle,
  Callout,
  OverlayComponent,
  Marker,
  Overlay,
} from "react-native-maps";
import * as Location from "expo-location";

import SearchBar from "../Components/SearchBar";
import StatusBar from "../Components/StatusBar";
import HomeMap from "../Components/HomeMap";

const MainView = ({ navigation }) => {
  const homeMapRef = useRef(null);
  console.log("rerendered");

  const [dataInfo, setDataInfo] = useState(null);
  const [dataStatus, setDataStatus] = useState(null);

  const [stationInfo, setStationInfo] = useState(null);

  const [startPoint, setStart] = useState(null);
  const [endPoint, setEnd] = useState(null);

  const urlInfo =
    "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json";

  const urlStatus =
    "https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json";

  useEffect(() => {
    console.log("Mounted Main(useEffect)");
    fetch(urlInfo)
      .then((response) => response.json())
      .then((dataInfo) => setDataInfo(dataInfo["data"]["stations"]))
      .catch((error) => console.error(error));

    fetch(urlStatus)
      .then((response) => response.json())
      .then((dataStatus) => setDataStatus(dataStatus["data"]["stations"]))
      .catch((error) => console.error(error));

    return () => {
      console.log("Main unmounting");
    };
  }, []);

  return (
    <View>
      <HomeMap
        mapRef={homeMapRef}
        dataInfo={dataInfo}
        dataStatus={dataStatus}
        setStationInfo={setStationInfo}
      />

      <SearchBar
        startPoint={startPoint}
        dataInfo={dataInfo}
        dataStatus={dataStatus}
        endPoint={endPoint}
        navigation={navigation}
      />

      <StatusBar
        mapRef={homeMapRef}
        dataStatus={dataStatus}
        stationInfo={stationInfo}
        setStart={setStart}
        setEnd={setEnd}
      />
    </View>
  );
};

export default MainView;
