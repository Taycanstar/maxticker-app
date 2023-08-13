import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { Button, Layout, useTheme } from "@ui-kitten/components";

type Props = {};

const AddScreen: React.FC = () => {
  const theme = useTheme();
  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <SafeAreaView>
        <Text>HomeScreen</Text>
      </SafeAreaView>
    </Layout>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
