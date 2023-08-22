// TimerComponent.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Circle, Svg } from "react-native-svg";
import { Layout, useTheme } from "@ui-kitten/components";
import Feather from "@expo/vector-icons/Feather";
import Stopwatch from "../components/Stopwatch";
import Laps from "../components/Laps";

type props = {};

const screenHeight = Dimensions.get("window").height;

const MultipleScreen: React.FC<props> = () => {
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const theme = useTheme();

  const list = [
    {
      name: "Reading",
      strokeColor: theme["ios-blue"],
      goalTime: 20000,
    },
    {
      name: "Working",
      strokeColor: theme["ios-red"],
      goalTime: 30000,
    },
    {
      name: "Running",
      strokeColor: theme["ios-yellow"],
      goalTime: 10000,
    },
    {
      name: "Lor",
      strokeColor: theme["ios-green"],
      goalTime: 10000,
    },
  ];

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.watches}>
          {list.map((watch, index) => {
            return (
              <View
                style={[
                  styles.watch1,
                  {
                    marginRight: index % 2 === 0 ? 0 : 0,
                    marginLeft: index % 2 !== 0 ? 0 : 0,
                  },
                ]}
                key={index}
              >
                <Stopwatch
                  name={watch.name}
                  goalTime={watch.goalTime}
                  strokeColor={watch.strokeColor}
                />
              </View>
            );
          })}
        </View>
        <View>
          <Laps
            timerName={""}
            onTitlePress={() => {}}
            laps={[]}
            setLaps={() => {}}
          />
        </View>
      </View>
    </Layout>
  );
};

export default MultipleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  watches: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  watch1: {
    marginVertical: 20,
  },
});
