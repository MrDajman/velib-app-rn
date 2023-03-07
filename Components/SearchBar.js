import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const SearchBar = ({
  startPoint,
  endPoint,
  navigation,
  dataInfo,
  dataStatus,
}) => {
  const handleGoButton = () => {
    console.log("in Go button!");

    navigation.navigate("TrackView", {
      startPoint: startPoint,
      endPoint: endPoint,
      dataInfo: dataInfo,
      dataStatus: dataStatus,
    });
  };

  return (
    <View className="absolute h-auto w-full top-5 p-5 ">
      <View className="bg-red-200 rounded-lg flex-row">
        <View className="flex-1">
          <View className="flex-row flex-1 p-1">
            <Text className="p-3 w-1/4">Start: </Text>
            <View className="bg-red-400 flex-1 h-full rounded ">
              <Text>{startPoint ? startPoint["name"] : "..."}</Text>
            </View>
          </View>

          <View className="flex-row flex-1 p-1">
            <Text className="p-3 w-1/4">End: </Text>
            <View className="bg-red-400 flex-1 h-full rounded ">
              <Text>{endPoint ? endPoint["name"] : "..."}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="w-16 h-full bg-red-300"
          onPress={() => {
            handleGoButton();
          }}
        >
          <Text>go!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
