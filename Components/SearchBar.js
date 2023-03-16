import { View, Text, TouchableOpacity, Alert } from "react-native";
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

  const showAlert = () =>
    Alert.alert(
      "Station not chosen",
      "Please select a station and confirm your choice by the button on the bottom of the screen",
      [
        {
          text: "Close",
          onPress: () => console.log("alert dismissed by clicking Close"),
          style: "close",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log("alert dismissed by clicking nowhere"),
      }
    );

  return (
    <View className="absolute h-auto w-full top-6 p-5 ">
      <View className="bg-white border-2 border-gray-400 opacity-80 rounded-lg flex-row">
        <View className="flex-1">
          <View className="flex-row flex-1 p-1">
            <Text className="p-3 w-1/4">Start: </Text>
            <View className="bg-gray-300 flex-1 h-full rounded justify-center items-center">
              <Text>{startPoint ? startPoint["name"] : "..."}</Text>
            </View>
          </View>

          <View className="flex-row flex-1 p-1">
            <Text className="p-3 w-1/4">End: </Text>
            <View className="bg-gray-300 flex-1 h-full rounded justify-center items-center">
              <Text>{endPoint ? endPoint["name"] : "..."}</Text>
            </View>
          </View>
        </View>
        <View className="p-2">
          <TouchableOpacity
            className={
              "w-16 h-full justify-center items-center rounded-lg " +
              (endPoint && startPoint ? "bg-blue-300" : "bg-gray-500")
            }
            onPress={() => {
              endPoint && startPoint ? handleGoButton() : showAlert();
            }}
          >
            <Text>GO!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SearchBar;
