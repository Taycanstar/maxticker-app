import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { useTheme } from "@ui-kitten/components";
import { blackLogo, whiteLogo } from "../images/ImageAssets";
import { Card, Button, Layout } from "@ui-kitten/components";

type Props = {};

const AddScreen: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.content,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme["background-basic-color-1"],
        }}
      >
        <View
          style={{
            flex: 0.02,
            backgroundColor: theme["box-bg"],
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginHorizontal: 20,
            marginTop: 5,
          }}
        ></View>
        <View
          style={[styles.container, { backgroundColor: "rgba(0,0,0,0.2)" }]}
        >
          <View
            style={{
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              backgroundColor: theme["box-bg"],
              flex: 1,
            }}
          >
            <Text>ADD MODAAL</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 44,
  },
});
