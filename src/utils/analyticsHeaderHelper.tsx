import React from "react";
import { Image, TouchableOpacity, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../constants/Colors";
import { blackLogo } from "../images/ImageAssets";
import { StackNavigationOptions } from "@react-navigation/stack";
// Also, import 'Colors' and 'blackLogo' if they are external dependencies.

export const getHeaderOptions = (
  navigation: any,
  theme: any,
  isModalVisible: boolean,
  onModalPress: any,
  currentItem: string
): StackNavigationOptions => ({
  headerTitle: () => (
    <>
      <Image
        source={blackLogo}
        style={{ width: 60, height: 60 }}
        resizeMode="contain"
      />
    </>
  ),
  headerLeft: () => (
    <TouchableOpacity
      onPress={onModalPress}
      style={{
        paddingHorizontal: 15,
        flexDirection: "row",
        backgroundColor: theme["background-basic-color-1"],
      }}
    >
      <Text
        style={{
          color: theme["text-basic-color"],
          fontSize: 22,
          fontWeight: "500",
          marginRight: 5,
        }}
      >
        {currentItem}
      </Text>
      <Feather
        color={Colors.metagray2}
        size={20}
        name={isModalVisible ? "chevron-up" : "chevron-down"}
      />
    </TouchableOpacity>
  ),
  // headerRight: null,
});
