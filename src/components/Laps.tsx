import {
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Layout, useTheme } from "@ui-kitten/components";
import React from "react";

type LapProps = {
  laps: Array<{ time: number; name: string }>;
  timerName: string;
  onTitlePress: () => void;
  setLaps: (laps: Array<{ time: number; name: string }>) => void;
};

const formatNumber = (number: number) => String(number).padStart(2, "0");

const Laps: React.FC<LapProps> = ({
  laps,
  timerName,
  onTitlePress,
  setLaps,
}) => {
  const theme = useTheme(); // Assuming you're using the @ui-kitten/components library

  return (
    <ScrollView
      style={styles.lapsContainer}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={onTitlePress}>
        <Text>{timerName}</Text>
      </TouchableOpacity>
      {laps.map((lap, index) => {
        const lapMinutes = formatNumber(Math.floor(lap.time / 60000));
        const lapSeconds = formatNumber(Math.floor((lap.time % 60000) / 1000));
        const lapMilliseconds = formatNumber(
          Math.floor((lap.time % 1000) / 10)
        );

        return (
          <View key={index} style={styles.lap}>
            <TextInput
              onSubmitEditing={() => {}}
              style={{
                color: theme["text-basic-color"],
                fontSize: 15,
                borderBottomWidth: 0,
                borderColor: theme["text-basic-color"],
              }}
              value={lap.name}
              onChangeText={(text) => {
                const updatedLaps = [...laps];
                updatedLaps[index].name = text;
                setLaps(updatedLaps);
              }}
            />
            <Text style={{ color: theme["text-basic-color"], fontSize: 15 }}>
              {lapMinutes}:{lapSeconds}.{lapMilliseconds}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Laps;

const styles = StyleSheet.create({
  lapsContainer: {
    width: "100%",
    maxHeight: 200,
    paddingHorizontal: 20,
    marginBottom: 58,
    marginTop: 10,
  },
  lap: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
