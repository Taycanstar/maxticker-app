import React from "react";
import { Image, TouchableOpacity, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Colors from "../constants/Colors";
import { blackLogo } from "../images/ImageAssets";
import { SafeAreaView } from "react-native-safe-area-context";

type CustomHeaderProps = {
  navigation: any; // You can be more specific about the type here if you have specific types
  theme: any; // Similarly, you can specify the theme type if you have one
  isModalVisible: boolean;
  onModalPress: () => void;
  currentItem: string;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  navigation,
  theme,
  isModalVisible,
  onModalPress,
  currentItem,
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 15,
      backgroundColor: theme["background-basic-color-1"],
      paddingTop: 40,
    }}
  >
    {/* Left Part */}
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={onModalPress}
        style={{
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
    </View>

    {/* Center (Title) */}
    <View style={{ alignItems: "center", flex: 2 }}>
      <Image
        source={blackLogo}
        style={{ width: 60, height: 60 }}
        resizeMode="contain"
      />
    </View>

    {/* Right (which is null in your case, but kept for future use) */}
    <View style={{ flex: 1 }}></View>
  </View>
);

export default CustomHeader;
