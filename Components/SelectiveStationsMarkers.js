import { View, Text } from "react-native";
import React from "react";
import { getDistance } from "geolib";
import MapView, { Marker, Polyline } from "react-native-maps";

const SelectiveStationsMarkers = ({
  dataInfo,
  dataStatus,
  point,
  parking,
  order,
  setStationsFunc,
  chosenStations,
}) => {
  const handleSelectiveMarkerPress = (station, order, chosenStations) => {
    console.log("SelectiveMarkerPressed" + order + station["name"]);
    const newChosenStations = chosenStations;
    newChosenStations[order] = String(
      "lat:" + station["lat"] + ":lon:" + station["lon"]
    );
    console.log(newChosenStations);
    setStationsFunc(newChosenStations);
  };
  return (
    <View>
      {dataInfo
        ? dataStatus
          ? dataInfo.map((station) =>
              getDistance(
                {
                  latitude: station["lat"],
                  longitude: station["lon"],
                },
                point
              ) < 800 ? (
                <Marker
                  key={station["station_id"]}
                  title="Test"
                  description="xxx"
                  onPress={() => {
                    handleSelectiveMarkerPress(station, order, chosenStations);
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
              ) : (
                ""
              )
            )
          : console.log("Loading the Velib' map")
        : console.log("Loading the Velib' map")}
      {/* Outer ring! */}
      {dataInfo
        ? dataStatus
          ? dataInfo.map((station) =>
              getDistance(
                {
                  latitude: station["lat"],
                  longitude: station["lon"],
                },
                point
              ) < 800 ? (
                <Marker
                  key={station["station_id"] + "_outer"}
                  title="Test"
                  description="xxx_outer"
                  onPress={() => {
                    console.log("Marker pressed!");
                  }}
                  coordinate={{
                    latitude: station["lat"],
                    longitude: station["lon"],
                  }}
                  icon={
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
              ) : (
                ""
              )
            )
          : console.log("Loading the Velib' map")
        : console.log("Loading the Velib' map")}
    </View>
  );
};

export default SelectiveStationsMarkers;

// {
//   /* {dataInfo
//           ? dataStatus
//             ? dataInfo.map((station) =>
//                 getDistance(
//                   {
//                     latitude: station["lat"],
//                     longitude: station["lon"],
//                   },
//                   {
//                     latitude: startPoint["lat"],
//                     longitude: startPoint["lon"],
//                   }
//                 ) < 800 ||
//                 getDistance(
//                   {
//                     latitude: station["lat"],
//                     longitude: station["lon"],
//                   },
//                   {
//                     latitude: endPoint["lat"],
//                     longitude: endPoint["lon"],
//                   }
//                 ) < 800 ? (
//                   <Marker
//                     key={station["station_id"]}
//                     title="Test"
//                     description="xxx"
//                     onPress={() => {
//                       console.log("Marker pressed!");
//                       handleMarkerPress(station);
//                     }}
//                     coordinate={{
//                       latitude: station["lat"],
//                       longitude: station["lon"],
//                     }}
//                     icon={
//                       dataStatus.find(
//                         (item) => item["station_id"] === station["station_id"]
//                       )["num_bikes_available_types"][0]["mechanical"] === 0
//                         ? require("../assets/icon_red.png")
//                         : dataStatus.find(
//                             (item) =>
//                               item["station_id"] === station["station_id"]
//                           )["num_bikes_available_types"][0]["mechanical"] < 2
//                         ? require("../assets/icon_orange.png")
//                         : dataStatus.find(
//                             (item) =>
//                               item["station_id"] === station["station_id"]
//                           )["num_bikes_available_types"][0]["mechanical"] < 4
//                         ? require("../assets/icon_yellow.png")
//                         : require("../assets/icon_green.png")
//                     }
//                     anchor={{ x: 0.5, y: 0.5 }}
//                   ></Marker>
//                 ) : (
//                   ""
//                 )
//               )
//             : console.log("Loading the Velib' map")
//           : console.log("Loading the Velib' map")} */
// }
