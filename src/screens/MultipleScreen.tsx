// TimerComponent.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Layout, useTheme } from "@ui-kitten/components";
import Stopwatch from "../components/Stopwatch";
import AddTimer from "../components/AddTimer";
import { useTasks } from "../contexts/TaskContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import PlusTimer from "../components/PlusTimer";

const screenWidth = Dimensions.get("window").width;

const MultipleScreen: React.FC = () => {
  const { tasks, fetchTasks } = useTasks();
  // Assuming useTasks is your context hook

  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeStopwatchId, setActiveStopwatchId] = useState<string | null>(
    null
  );

  const theme = useTheme();

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Multiple">>();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.watches}>
          {tasks.map((task, index) => (
            <View style={styles.watch1} key={index}>
              <Stopwatch
                name={task.name}
                goalTime={task.goal}
                strokeColor={task.color}
                id={task._id}
              />
            </View>
          ))}
          {tasks.length < 4 ? (
            <View style={styles.watch1}>
              <AddTimer onPress={() => navigation.navigate("Add")} />
            </View>
          ) : (
            <View style={styles.watch1}>
              <PlusTimer onPress={() => navigation.navigate("Subscription")} />
            </View>
          )}
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
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 10,
  },

  watch1: {
    // Set the width to half of the screen's width
    marginVertical: 20,
  },
});
