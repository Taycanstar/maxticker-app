import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import { useTasks, Task } from "../contexts/TaskContext";
import GeneralCard from "../components/GeneralCard";
import { ScrollView } from "react-native-gesture-handler";

type DayProps = {
  day: string; // in YYYY-MM-DD format
  isActive: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_WIDTH = SCREEN_WIDTH / 3;
const monthMapping: { [key: string]: number } = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const Day: React.FC<DayProps> = ({ day, isActive }) => {
  const theme = useTheme();
  const formatDate = (dateString: string) => {
    if (!dateString) return ""; // return an empty string if dateString is falsy

    const date = new Date(dateString);

    const dayOfWeek = dayNames[date.getDay()];
    const month = monthNames[date.getMonth()];
    const dayOfMonth = date.getDate();

    return `${dayOfWeek}, ${month} ${dayOfMonth}`;
  };
  return (
    <View
      style={[
        styles.dayContainer,
        isActive
          ? [
              styles.activeDay,
              {
                borderBottomColor: theme["text-basic-color"],
                borderBottomWidth: 1,
              },
            ]
          : {},
      ]}
    >
      <Text
        style={[
          styles.dayText,
          isActive
            ? [styles.activeDayText, { color: theme["text-basic-color"] }]
            : {},
        ]}
      >
        {formatDate(day)}
      </Text>
    </View>
  );
};

const DailyScreen: React.FC = () => {
  const flatListRef = useRef<FlatList | null>(null);
  const theme = useTheme();
  const userSignupDate = useSelector(
    (state: any) => state.user?.userSignupDate
  );
  const { tasks } = useTasks();
  const [dayScrollPosition, setDayScrollPosition] = useState(0);
  const getStartAndEndDatesForDay = (dayRange: string) => {
    const start = new Date(dayRange);
    const end = new Date(dayRange);
    end.setHours(23, 59, 59, 999); // Set to end of the day

    return { start, end };
  };

  const colors = [
    "rgb(55,120,181)",
    "rgb(94,190,255)",
    theme["pale-gray"],
    "rgb(28,54,105)",

    theme["text-basic-color"],
  ];

  const generateMonthRanges = (signupDate: Date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const monthRanges: string[] = [];

    // Ensure signupDate is a Date object
    let startDate = new Date(signupDate);
    // Adjust the signupDate to the first of the month
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    while (startDate <= currentDate) {
      const startMonth = monthNames[startDate.getMonth()];

      let monthRange = `${startMonth} ${startDate.getFullYear()}`;

      monthRanges.push(monthRange);
      startDate.setMonth(startDate.getMonth() + 1);
    }

    return monthRanges;
  };

  // const generateDayRanges = (signupDate: Date) => {
  //   const currentDate = new Date();
  //   currentDate.setHours(0, 0, 0, 0);
  //   currentDate.setDate(currentDate.getDate() + 1);

  //   let startDate = new Date(signupDate);
  //   // startDate.setDate(endDate.getDate() - 9);
  //   startDate.setHours(0, 0, 0, 0);

  //   const dayRanges: string[] = [];

  //   while (startDate <= currentDate) {
  //     dayRanges.push(startDate.toISOString().split("T")[0]);
  //     startDate.setDate(startDate.getDate() + 1);
  //   }

  //   return dayRanges;
  // };

  const generateDayRanges = () => {
    let endDate = new Date();
    endDate.setHours(0, 0, 0, 0);

    let startDate = new Date();
    startDate.setDate(endDate.getDate() - 9); // Set to 10 days ago, including today
    startDate.setHours(0, 0, 0, 0);

    const dayRanges: string[] = [];

    for (let i = 0; i < 10; i++) {
      dayRanges.push(startDate.toISOString().split("T")[0]);
      startDate.setDate(startDate.getDate() + 1);
    }

    return dayRanges;
  };

  const dayRanges = generateDayRanges();

  const monthRanges = generateMonthRanges(userSignupDate);

  const dayRangesWithDummy = ["", ...dayRanges, ""];

  const findCurrentDayIndex = () => {
    const currentMonthStr = new Date().toISOString().slice(0, 7); // gets the 'YYYY-MM' format

    if (Array.isArray(monthRanges)) {
      const index = monthRanges.indexOf(currentMonthStr);
      return index === -1 ? monthRanges.length - 1 : index;
    }

    return -1;
  };
  const realLifeCurrentDayIndex = findCurrentDayIndex();
  const [currentDayIndex, setCurrentDayIndex] = useState(
    realLifeCurrentDayIndex
  );

  const handleDayScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / DAY_WIDTH);
    // setDayScrollPosition(scrollPosition);
    setDayScrollPosition(scrollPosition);
    setCurrentDayIndex(currentIndex + 1);
  };
  const { start: dayStart, end: dayEnd } = getStartAndEndDatesForDay(
    dayRangesWithDummy[currentDayIndex]
  );

  // Gets today's date in YYYY-MM-DD format

  // Today's date range
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  // Calculate total time spent on tasks today
  const totalToday = tasks.reduce((sum, task) => {
    const todaySessions = task.sessions
      ? task.sessions.filter((session) => {
          const startTime = new Date(session.createdAt);
          return startTime >= startOfDay && startTime <= endOfDay;
        })
      : [];
    return (
      sum +
      todaySessions.reduce((sum, session) => sum + session.totalDuration, 0)
    );
  }, 0);
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      {/* <FlatList
        horizontal
        snapToInterval={DAY_WIDTH}
        ref={flatListRef}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleDayScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        data={dayRangesWithDummy}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <Day day={item} isActive={index === currentDayIndex} />
        )}
        getItemLayout={(data, index) => ({
          length: DAY_WIDTH,
          offset: DAY_WIDTH * index,
          index,
        })}
        onLayout={() =>
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: dayRangesWithDummy.length - 1,
              animated: false,
            });
          }, 100)
        }
      /> */}
      <ScrollView
        style={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <GeneralCard
          tasks={tasks}
          title={"Total"}
          colors={colors}
          type={"dailyTotal"}
          start={startOfDay}
          end={endOfDay}
        />
        <GeneralCard
          tasks={tasks}
          title={"Avg Session"}
          colors={colors}
          type={"dailyAvgSession"}
          start={startOfDay}
          end={endOfDay}
        />
        <GeneralCard
          tasks={tasks}
          title={"Goal Completion Rate"}
          colors={colors}
          type={"dailyGoalCompletionRate"}
          start={startOfDay}
          end={endOfDay}
        />
        <GeneralCard
          tasks={tasks}
          title={"Avg Breaks / Session"}
          colors={colors}
          type={"dailyAvgBreaksPerSession"}
          start={startOfDay}
          end={endOfDay}
        />
        <GeneralCard
          tasks={tasks}
          title={"Time Spent on Breaks"}
          colors={colors}
          type={"dailyTimeSpentOnBreaks"}
          start={startOfDay}
          end={endOfDay}
        />
      </ScrollView>
    </View>
  );
};

export default DailyScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingBottom: 130,
    // height: "100%",
  },
  dayContainer: {
    width: DAY_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    opacity: 0.9,
    marginTop: 10,
  },
  dayText: {
    fontSize: 14,
    color: "grey",
  },
  activeDay: {
    opacity: 1,
  },
  activeDayText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  scrollView: {
    position: "relative",
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // maxHeight: 54,
  },
});
