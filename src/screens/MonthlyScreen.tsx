import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import { useTasks, Task } from "../contexts/TaskContext";
import GeneralCard from "../components/GeneralCard";
import { ScrollView } from "react-native-gesture-handler";

type MonthProps = {
  month: string; // in YYYY-MM-DD format
  isActive: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const MONTH_WIDTH = SCREEN_WIDTH / 3;
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

const Month: React.FC<MonthProps> = ({ month, isActive }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.monthContainer,
        isActive
          ? [
              styles.activeMonth,
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
          styles.monthText,
          isActive
            ? [styles.activeMonthText, { color: theme["text-basic-color"] }]
            : {},
        ]}
      >
        {month}
      </Text>
    </View>
  );
};

const MonthlyScreen: React.FC = () => {
  const flatListRef = useRef<FlatList | null>(null);
  const theme = useTheme();
  const userSignupDate = useSelector(
    (state: any) => state.user?.userSignupDate
  );
  const { tasks } = useTasks();
  const [monthScrollPosition, setMonthScrollPosition] = useState(0);

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

  const getStartAndEndDatesForMonth = (monthRange: string) => {
    const splitRange = monthRange.split(" ");
    const month = monthMapping[splitRange[0]];
    const year = parseInt(splitRange[1], 10);

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0); // last day of the month

    return { monthStart, monthEnd };
  };

  const monthRanges = generateMonthRanges(userSignupDate);

  const monthRangesWithDummy = ["", ...monthRanges, ""];

  const findCurrentMonthIndex = () => {
    const currentMonthStr = new Date().toISOString().slice(0, 7);

    if (Array.isArray(monthRanges)) {
      const index = monthRanges.indexOf(currentMonthStr);
      return index === -1 ? monthRanges.length - 1 : index;
    }

    return -1;
  };
  const realLifeCurrentMonthIndex = findCurrentMonthIndex();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(
    realLifeCurrentMonthIndex
  );

  const handleMonthScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / MONTH_WIDTH);
    // setDayScrollPosition(scrollPosition);
    setMonthScrollPosition(scrollPosition);
    setCurrentMonthIndex(currentIndex + 1);
  };
  const { monthStart, monthEnd } = getStartAndEndDatesForMonth(
    monthRangesWithDummy[currentMonthIndex]
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <FlatList
        horizontal
        snapToInterval={MONTH_WIDTH}
        contentContainerStyle={
          {
            /*maxHeight: 64*/
          }
        }
        ref={flatListRef}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleMonthScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        data={monthRangesWithDummy}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <Month month={item} isActive={index === currentMonthIndex} />
        )}
        onLayout={() =>
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: monthRangesWithDummy.length - 1,
              animated: false,
            });
          }, 100)
        }
      />
      <ScrollView
        style={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <GeneralCard
          tasks={tasks}
          title={"Total"}
          colors={colors}
          type={"monthlyTotal"}
          start={monthStart}
          end={monthEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Avg Session"}
          colors={colors}
          type={"monthlyAvgSession"}
          start={monthStart}
          end={monthEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Goal Completion Rate"}
          colors={colors}
          type={"monthlyGoalCompletionRate"}
          start={monthStart}
          end={monthEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Avg Breaks / Session"}
          colors={colors}
          type={"monthlyAvgBreaksPerSession"}
          start={monthStart}
          end={monthEnd}
        />
        <GeneralCard
          tasks={tasks}
          title={"Time Spent on Breaks"}
          colors={colors}
          type={"monthlyTimeSpentOnBreaks"}
          start={monthStart}
          end={monthEnd}
        />
      </ScrollView>
    </View>
  );
};

export default MonthlyScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingBottom: 130,
    // height: "100%",
  },
  monthContainer: {
    width: MONTH_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    opacity: 0.9,
    marginTop: 10,
  },
  monthText: {
    fontSize: 14,
    color: "grey",
  },
  activeMonth: {
    opacity: 1,
  },
  activeMonthText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  scrollView: {
    position: "relative",
  },
});
