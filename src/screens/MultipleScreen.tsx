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

const screenWidth = Dimensions.get("window").width;

const MultipleScreen: React.FC = () => {
  const { tasks, fetchTasks } = useTasks();
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const theme = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Multiple">>();

  useEffect(() => {
    fetchTasks();
  }, []);

  // return (
  //   <Layout
  //     style={[
  //       styles.container,
  //       { backgroundColor: theme["background-basic-color-1"] },
  //     ]}
  //   >
  //     <View style={styles.content}>
  //       <View style={styles.watches}>
  //         {tasks.map((task, index) => (
  //           <View
  //             style={[
  //               styles.watch1,
  //               {
  //                 marginRight: index % 2 === 0 ? 0 : 0,
  //                 marginLeft: index % 2 !== 0 ? 0 : 0,
  //               },
  //             ]}
  //             key={index}
  //           >
  //             <Stopwatch
  //               name={task.name}
  //               goalTime={task.goal}
  //               strokeColor={task.color}
  //               timerState="stopped"
  //               onTimerStateChange={(newState) => {
  //                 // Handle timer state change if needed
  //               }}
  //               onLap={(lapTime) => {
  //                 // Handle lap time if needed
  //               }}
  //             />
  //           </View>
  //         ))}
  //         <AddTimer onPress={() => navigation.navigate("Add")} />
  //       </View>
  //     </View>
  //   </Layout>
  // );

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
                timerState="stopped"
                onTimerStateChange={(newState) => {
                  // Handle timer state change if needed
                }}
                onLap={(lapTime) => {
                  // Handle lap time if needed
                }}
              />
            </View>
          ))}
          <View style={styles.watch1}>
            <AddTimer onPress={() => navigation.navigate("Add")} />
          </View>
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
    marginVertical: 20,
  },
});
