import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import { useTasks, Task } from "../contexts/TaskContext";
import GeneralCard from "../components/GeneralCard";
import { ScrollView } from "react-native-gesture-handler";

type WeekProps = {
  week: string; // in YYYY-MM-DD format
  isActive: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const WEEK_WIDTH = SCREEN_WIDTH / 3;
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
const Week: React.FC<WeekProps> = ({ week, isActive }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.weekContainer,
        isActive
          ? [
              styles.activeWeek,
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
          styles.weekText,
          isActive
            ? [styles.activeWeekText, { color: theme["text-basic-color"] }]
            : {},
        ]}
      >
        {week}
      </Text>
    </View>
  );
};

const WeeklyScreen: React.FC = () => {
  const flatListRef = useRef<FlatList | null>(null);
  const theme = useTheme();
  const userSignupDate = useSelector(
    (state: any) => state.user?.userSignupDate
  );
  const { tasks } = useTasks();
  const [weekScrollPosition, setWeekScrollPosition] = useState(0);

  const colors = [
    "rgb(55,120,181)",
    "rgb(94,190,255)",
    theme["pale-gray"],
    "rgb(28,54,105)",

    theme["text-basic-color"],
  ];

  // const generateWeekRanges = (signupDate: Date) => {
  //   const currentDate = new Date();
  //   currentDate.setHours(0, 0, 0, 0);
  //   const weekRanges: string[] = [];

  //   // Adjust the signupDate to the closest previous Sunday
  //   let startDate = new Date(signupDate);
  //   while (startDate.getDay() !== 0) {
  //     // 0 represents Sunday
  //     startDate.setDate(startDate.getDate() - 1);
  //   }
  //   startDate.setHours(0, 0, 0, 0);

  //   while (startDate <= currentDate) {
  //     const endDate = new Date(startDate);
  //     endDate.setDate(startDate.getDate() + 6);

  //     const startMonth = monthNames[startDate.getMonth()];
  //     const endMonth = monthNames[endDate.getMonth()];
  //     const startDay = startDate.getDate();
  //     const endDay = endDate.getDate();

  //     let weekRange =
  //       startMonth === endMonth
  //         ? `${startMonth} ${startDay} - ${endDay}`
  //         : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

  //     weekRanges.push(weekRange);
  //     startDate.setDate(startDate.getDate() + 7);
  //   }

  //   return weekRanges;
  // };

  const generateWeekRanges = () => {
    const weekRanges: string[] = [];
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Find the start of the current week (Sunday)
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Generate ranges for the last 10 weeks
    for (let i = 0; i < 10; i++) {
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 6); // Add 6 days to get the end of the week

      const startMonth = monthNames[currentDate.getMonth()];
      const endMonth = monthNames[endDate.getMonth()];
      const startDay = currentDate.getDate();
      const endDay = endDate.getDate();
      const year = currentDate.getFullYear();

      let weekRange =
        startMonth === endMonth
          ? `${startMonth} ${startDay}-${endDay}, ${year}`
          : `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;

      weekRanges.unshift(weekRange);
      currentDate.setDate(currentDate.getDate() - 7); // Move to the previous week
    }

    return weekRanges;
  };

  const getStartAndEndDatesForWeek = (weekRange: string) => {
    const splitRange = weekRange.split(" - ");

    const startMonthAndDay = splitRange[0].split(" ");
    const endDay = parseInt(splitRange[1], 10);

    const startYear = new Date().getFullYear();
    const startMonth = monthMapping[startMonthAndDay[0]];
    const startDay = parseInt(startMonthAndDay[1], 10);

    let start = new Date(startYear, startMonth, startDay);
    let end = new Date(startYear, startMonth, endDay);

    // Adjusting for year-end crossover
    if (end < start) {
      end.setFullYear(end.getFullYear() + 1);
    }

    return { start, end };
  };

  const weekRanges = generateWeekRanges();

  const weekRangesWithDummy = ["", ...weekRanges, ""];

  function getWeekStartDate() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // Sunday - Saturday : 0 - 6
    const numDayFromStartOfWeek = now.getUTCDate() - dayOfWeek;
    const startOfWeek = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      numDayFromStartOfWeek
    );
    return startOfWeek.toISOString().split("T")[0];
  }

  const findCurrentWeekIndex = () => {
    const currentWeekStart = getWeekStartDate();
    const currentWeekEnd = new Date(
      new Date(currentWeekStart).getTime() + 6 * 24 * 60 * 60 * 1000
    ); // Adding 6 days

    const currentWeekRangeStr = `${
      monthNames[new Date(currentWeekStart).getMonth()]
    } ${new Date(currentWeekStart).getDate()} - ${new Date(
      currentWeekEnd
    ).getDate()}`;

    const index = weekRanges.indexOf(currentWeekRangeStr);
    return index === -1 ? weekRanges.length - 1 : index;
  };

  const realLifeCurrentWeekIndex = findCurrentWeekIndex();

  const [currentWeekIndex, setCurrentWeekIndex] = useState(
    realLifeCurrentWeekIndex
  );
  //dd

  const handleWeekScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / WEEK_WIDTH);

    if (currentIndex !== currentWeekIndex) {
      setCurrentWeekIndex(currentIndex);
    }
  };
  const { start, end } = getStartAndEndDatesForWeek(
    weekRangesWithDummy[currentWeekIndex]
  );

  // Calculate the start and end dates of the current week
  const currentDate = new Date();
  const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Sunday is the first day
  const lastDayOfWeek = firstDayOfWeek + 6; // Saturday is the last day

  const weekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    firstDayOfWeek
  );
  const weekEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    lastDayOfWeek
  );
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      {/* <FlatList
        horizontal
        snapToInterval={WEEK_WIDTH}
       
        ref={flatListRef}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleWeekScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        data={weekRangesWithDummy}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <Week week={item} isActive={index === currentWeekIndex} />
        )}
        getItemLayout={(data, index) => ({
          length: WEEK_WIDTH,
          offset: WEEK_WIDTH * index,
          index,
        })}
        onLayout={() =>
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: weekRangesWithDummy.length - 1,
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
          type={"weeklyTotal"}
          start={weekStart}
          end={weekEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Avg Session"}
          colors={colors}
          type={"weeklyAvgSession"}
          start={weekStart}
          end={weekEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Goal Completion Rate"}
          colors={colors}
          type={"weeklyGoalCompletionRate"}
          start={weekStart}
          end={weekEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Avg Breaks / Session"}
          colors={colors}
          type={"weeklyAvgBreaksPerSession"}
          start={weekStart}
          end={weekEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Time Spent on Breaks"}
          colors={colors}
          type={"weeklyTimeSpentOnBreaks"}
          start={weekStart}
          end={weekEnd}
        />
      </ScrollView>
    </View>
  );
};

export default WeeklyScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 130,
  },
  weekContainer: {
    width: WEEK_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    opacity: 0.9,
    marginTop: 10,
  },
  weekText: {
    fontSize: 14,
    color: "grey",
  },
  activeWeek: {
    opacity: 1,
  },
  activeWeekText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  scrollView: {
    position: "relative",
  },
});
