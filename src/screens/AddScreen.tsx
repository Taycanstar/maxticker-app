import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useState } from "react";
import Colors from "../constants/Colors";
import { Button, Layout, useTheme } from "@ui-kitten/components";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import Feather from "@expo/vector-icons/Feather";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

type Props = {};

const fetchFonts = () => {
  return Font.loadAsync({
    Merriweather: require("../assets/fonts/Merriweather-Regular.ttf"), // Adjust the path if needed
  });
};

const AddScreen: React.FC = () => {
  const theme = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  const onAddPress = () => {};

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <SafeAreaView>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
            How's the traffic in your mind?
          </Text>
          <Feather
            color={theme["text-basic-color"]}
            size={45}
            onPress={onAddPress}
            name="plus"
          />
        </View>
      </SafeAreaView>
    </Layout>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontFamily: "Merriweather",
    fontSize: 28,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
});
