import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Layout, useTheme } from "@ui-kitten/components";

type Props = {
  title: string;
  tasks: Task[];
  colors: string[];
  type: string;
  start?: any;
  end?: any;
};

export interface Task {
  _id: any;
  name: string;
  goal: number;
  color: string;
  sessions?: any[];
  timerState?: "stopped" | "running" | "paused";
}

const GeneralCard: React.FC<Props> = ({
  title,
  tasks,
  colors,
  type,
  start,
  end,
}) => {
  const theme = useTheme();
  const [totalTaskTime, setTotalTaskTime] = useState<number>(0);
  const [totalToday, setTotalToday] = useState<number>(0);
  const [totalThisMonth, setTotalThisMonth] = useState<number>(0);
  const [totalThisWeek, setTotalThisWeek] = useState<number>(0);
  const [sessionsToday, setSessionsToday] = useState<any[]>([]);
  const [sessionsThisWeek, setSessionsThisWeek] = useState<any[]>([]);
  const [sessionsThisMonth, setSessionsThisMonth] = useState<any[]>([]);

  useEffect(() => {
    const totalDuration = tasks.reduce(
      (sum, task: any) => sum + task.totalDuration,
      0
    );
    setTotalTaskTime(totalDuration);
  }, [tasks]);

  function formatDuration(durationInMilliseconds: number) {
    const seconds = Math.floor((durationInMilliseconds / 1000) % 60);
    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));

    const parts = [];

    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0) {
      parts.push(`${seconds}s`);
    }

    return parts.join(" ");
  }
  const today = new Date();
  useEffect(() => {
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

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
      0,
      0,
      0
    );
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay(),
      0,
      0,
      0
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 6,
      23,
      59,
      59
    );

    const updatedTasks = tasks.map((task) => {
      // Check if task.sessions is defined before filtering
      const todaySessions = task.sessions
        ? task.sessions.filter((session: any) => {
            const startTime = new Date(session.createdAt);
            return startTime >= startOfDay && startTime <= endOfDay;
          })
        : [];

      const monthSessions = task.sessions
        ? task.sessions.filter((session: any) => {
            const startTime = new Date(session.createdAt);
            return startTime >= startOfMonth && startTime <= endOfMonth;
          })
        : [];

      const weekSessions = task.sessions
        ? task.sessions.filter((session: any) => {
            const startTime = new Date(session.createdAt);
            return startTime >= startOfWeek && startTime <= endOfWeek;
          })
        : [];

      // Add the filtered sessions to the task
      return {
        ...task,
        todaySessions: todaySessions,
        monthSessions: monthSessions,
        weekSessions: weekSessions,
      };
    });

    // Separate the filtered arrays
    const filteredTodaySessions = updatedTasks.map(
      (task) => task.todaySessions
    );
    const filteredMonthSessions = updatedTasks.map(
      (task) => task.monthSessions
    );
    const filteredWeekSessions = updatedTasks.map((task) => task.weekSessions);

    // Update state variables
    setSessionsToday(filteredTodaySessions);
    setSessionsThisMonth(filteredMonthSessions);
    setSessionsThisWeek(filteredWeekSessions);

    // Calculate total duration for today's sessions
    const totalDurationToday = filteredTodaySessions.reduce(
      (total, sessions) => {
        return (
          total +
          sessions.reduce((sum, session) => sum + session.totalDuration, 0)
        );
      },
      0
    );

    // Calculate total duration for week's sessions
    const totalDurationWeek = filteredWeekSessions.reduce((total, sessions) => {
      return (
        total +
        sessions.reduce((sum, session) => sum + session.totalDuration, 0)
      );
    }, 0);

    // Calculate total duration for month's sessions
    const totalDurationMonth = filteredMonthSessions.reduce(
      (total, sessions) => {
        return (
          total +
          sessions.reduce((sum, session) => sum + session.totalDuration, 0)
        );
      },
      0
    );

    // Update state variables for total durations
    setTotalToday(totalDurationToday);
    setTotalThisMonth(totalDurationMonth);
    setTotalThisWeek(totalDurationWeek);
  }, [tasks]);

  return (
    <View style={[styles.container, { backgroundColor: theme["btn-bg"] }]}>
      {(() => {
        switch (type) {
          case "today":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
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

                    const todaySessions = task.sessions
                      ? task.sessions.filter((session: any) => {
                          const startTime = new Date(session.createdAt);
                          return (
                            startTime >= startOfDay && startTime <= endOfDay
                          );
                        })
                      : [];

                    const taskTotalDuration =
                      todaySessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalToday
                      : 0;

                    return totalToday !== 0 && taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(taskTotalDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "month":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startOfMonth = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      1,
                      0,
                      0,
                      0
                    );
                    const endOfMonth = new Date(
                      today.getFullYear(),
                      today.getMonth() + 1,
                      0,
                      23,
                      59,
                      59
                    );

                    const monthSessions = task.sessions
                      ? task.sessions.filter((session: any) => {
                          const startTime = new Date(session.createdAt);
                          return (
                            startTime >= startOfMonth && startTime <= endOfMonth
                          );
                        })
                      : [];

                    const taskTotalDuration =
                      monthSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalThisMonth
                      : 0;

                    return totalThisMonth !== 0 && taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(taskTotalDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "week":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startOfWeek = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - today.getDay(),
                      0,
                      0,
                      0
                    );
                    const endOfWeek = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - today.getDay() + 6,
                      23,
                      59,
                      59
                    );

                    const weekSessions = task.sessions
                      ? task.sessions.filter((session: any) => {
                          const startTime = new Date(session.createdAt);
                          return (
                            startTime >= startOfWeek && startTime <= endOfWeek
                          );
                        })
                      : [];

                    const taskTotalDuration =
                      weekSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalThisWeek
                      : 0;

                    return totalThisWeek !== 0 && taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(taskTotalDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "weeklyTotal":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForWeek = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };
                    let totalDurationForSelectedWeek = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForMonth = filterSessionsForWeek(
                          task.sessions || []
                        );
                        totalDurationForSelectedWeek +=
                          taskSessionsForMonth.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const weekSessions = task.sessions
                      ? filterSessionsForWeek(task.sessions)
                      : [];
                    //hi
                    // const weekSessions = task.sessions
                    //   ? task.sessions.filter((session: any) => {
                    //       const sessionDate = new Date(session.createdAt);
                    //       return (
                    //         sessionDate >= startDay &&
                    //         sessionDate < nextDayAfterEnd
                    //       );
                    //     })
                    //   : [];

                    const taskTotalDuration =
                      weekSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalDurationForSelectedWeek // Assuming you have totalThisWeek calculated
                      : 0;

                    return taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(taskTotalDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );

          case "weeklyAvgSession":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForWeek = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };
                    let totalDurationForSelectedWeek = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForMonth = filterSessionsForWeek(
                          task.sessions || []
                        );
                        totalDurationForSelectedWeek +=
                          taskSessionsForMonth.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const weekSessions = task.sessions
                      ? filterSessionsForWeek(task.sessions)
                      : [];
                    //hi

                    const taskTotalDuration =
                      weekSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const avgDuration =
                      weekSessions.length > 0
                        ? taskTotalDuration / weekSessions.length
                        : 0;

                    // Flex value based on average duration
                    const flexValue = avgDuration
                      ? avgDuration / totalDurationForSelectedWeek // Assuming you have totalThisWeek calculated
                      : 0;

                    return avgDuration !== 0 && taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(avgDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );

          case "weeklyAvgBreaksPerSession":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const weekSessions = task.sessions
                      ? task.sessions.filter((session: any) => {
                          const sessionDate = new Date(session.createdAt);
                          return (
                            sessionDate >= startDay &&
                            sessionDate < nextDayAfterEnd
                          );
                        })
                      : [];

                    const totalBreaksForTask = weekSessions.reduce(
                      (sum, session) => sum + (session.breaks || 0),
                      0
                    );
                    const avgBreaks =
                      weekSessions.length > 0
                        ? totalBreaksForTask / weekSessions.length
                        : 0;

                    const flexValue = avgBreaks
                      ? avgBreaks / totalBreaksForTask // Assuming you have totalThisWeek calculated
                      : 0;

                    return weekSessions.length !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {avgBreaks.toFixed(1)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "weeklyTimeSpentOnBreaks":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const weekSessions = task.sessions
                      ? task.sessions.filter((session: any) => {
                          const sessionDate = new Date(session.createdAt);
                          return (
                            sessionDate >= startDay &&
                            sessionDate < nextDayAfterEnd
                          );
                        })
                      : [];

                    const totalBreaksTimeThisWeek = tasks.reduce(
                      (totalBreakTime, task) => {
                        const weekSessions = task.sessions
                          ? task.sessions.filter((session: any) => {
                              const sessionDate = new Date(session.createdAt);
                              return (
                                sessionDate >= startDay &&
                                sessionDate < nextDayAfterEnd
                              );
                            })
                          : [];

                        return (
                          totalBreakTime +
                          weekSessions.reduce(
                            (sum, session) =>
                              sum + (session.timeSpentOnBreaks || 0),
                            0
                          )
                        );
                      },
                      0
                    );

                    const totalTimeSpentOnBreaksForTask = weekSessions.reduce(
                      (sum, session) => sum + (session.timeSpentOnBreaks || 0),
                      0
                    );

                    // For the flexValue calculation
                    const flexValue = totalTimeSpentOnBreaksForTask
                      ? totalTimeSpentOnBreaksForTask / totalBreaksTimeThisWeek
                      : 0;

                    return weekSessions.length !== 0 &&
                      totalTimeSpentOnBreaksForTask !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(totalTimeSpentOnBreaksForTask)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "weeklyGoalCompletionRate":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1);

                    const weekSessions = task.sessions
                      ? task.sessions.filter((session: any) => {
                          const sessionDate = new Date(session.createdAt);
                          return (
                            sessionDate >= startDay &&
                            sessionDate < nextDayAfterEnd
                          );
                        })
                      : [];

                    // Get the count of sessions that meet or exceed the goal
                    const completedSessionsCount = weekSessions.filter(
                      (session) => session.totalDuration >= task.goal
                    ).length;

                    // Calculate the goal completion rate
                    const completionRate =
                      weekSessions.length > 0
                        ? (completedSessionsCount / weekSessions.length) * 100
                        : 0; // This will be a percentage value between 0 and 100

                    return weekSessions.length !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${completionRate}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {completionRate.toFixed(0)}%
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );

          case "monthlyTotal":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForMonth = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedMonth = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForMonth = filterSessionsForMonth(
                          task.sessions || []
                        );
                        totalDurationForSelectedMonth +=
                          taskSessionsForMonth.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const monthSessions = task.sessions
                      ? filterSessionsForMonth(task.sessions)
                      : [];
                    const taskTotalDuration =
                      monthSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalDurationForSelectedMonth
                      : 0;

                    return taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(taskTotalDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );

          case "monthlyAvgSession":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForMonth = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedMonth = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForMonth = filterSessionsForMonth(
                          task.sessions || []
                        );
                        totalDurationForSelectedMonth +=
                          taskSessionsForMonth.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const monthSessions = task.sessions
                      ? filterSessionsForMonth(task.sessions)
                      : [];
                    const taskTotalDuration =
                      monthSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const avgDuration =
                      monthSessions.length > 0
                        ? taskTotalDuration / monthSessions.length
                        : 0;

                    // Flex value based on average duration
                    const flexValue = avgDuration
                      ? avgDuration / totalDurationForSelectedMonth // Assuming you have totalThisWeek calculated
                      : 0;

                    return avgDuration !== 0 && taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(avgDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );

          case "monthlyAvgBreaksPerSession":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForMonth = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedMonth = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForMonth = filterSessionsForMonth(
                          task.sessions || []
                        );
                        totalDurationForSelectedMonth +=
                          taskSessionsForMonth.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const monthSessions = task.sessions
                      ? filterSessionsForMonth(task.sessions)
                      : [];
                    const taskTotalDuration =
                      monthSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const totalBreaksForTask = monthSessions.reduce(
                      (sum, session) => sum + (session.breaks || 0),
                      0
                    );
                    const avgBreaks =
                      monthSessions.length > 0
                        ? totalBreaksForTask / monthSessions.length
                        : 0;

                    const flexValue = avgBreaks
                      ? avgBreaks / totalBreaksForTask // Assuming you have totalThisWeek calculated
                      : 0;

                    return monthSessions.length !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {avgBreaks.toFixed(1)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "monthlyTimeSpentOnBreaks":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForMonth = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedMonth = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForMonth = filterSessionsForMonth(
                          task.sessions || []
                        );
                        totalDurationForSelectedMonth +=
                          taskSessionsForMonth.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const monthSessions = task.sessions
                      ? filterSessionsForMonth(task.sessions)
                      : [];
                    const taskTotalDuration =
                      monthSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const totalBreaksTimeThisMonth = tasks.reduce(
                      (totalBreakTime, task) => {
                        const monthSessions = task.sessions
                          ? task.sessions.filter((session: any) => {
                              const sessionDate = new Date(session.createdAt);
                              return (
                                sessionDate >= startDay &&
                                sessionDate < nextDayAfterEnd
                              );
                            })
                          : [];

                        return (
                          totalBreakTime +
                          monthSessions.reduce(
                            (sum, session) =>
                              sum + (session.timeSpentOnBreaks || 0),
                            0
                          )
                        );
                      },
                      0
                    );

                    const totalTimeSpentOnBreaksForTask = monthSessions.reduce(
                      (sum, session) => sum + (session.timeSpentOnBreaks || 0),
                      0
                    );

                    // For the flexValue calculation
                    const flexValue = totalTimeSpentOnBreaksForTask
                      ? totalTimeSpentOnBreaksForTask / totalBreaksTimeThisMonth
                      : 0;

                    return monthSessions.length !== 0 &&
                      totalTimeSpentOnBreaksForTask !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(totalTimeSpentOnBreaksForTask)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "monthlyGoalCompletionRate":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1);

                    const filterSessionsForMonth = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedMonth = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForMonth = filterSessionsForMonth(
                          task.sessions || []
                        );
                        totalDurationForSelectedMonth +=
                          taskSessionsForMonth.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const monthSessions = task.sessions
                      ? filterSessionsForMonth(task.sessions)
                      : [];
                    const taskTotalDuration =
                      monthSessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalDurationForSelectedMonth
                      : 0;
                    //hi

                    // Get the count of sessions that meet or exceed the goal
                    const completedSessionsCount = monthSessions.filter(
                      (session) => session.totalDuration >= task.goal
                    ).length;

                    // Calculate the goal completion rate
                    const completionRate =
                      monthSessions.length > 0
                        ? (completedSessionsCount / monthSessions.length) * 100
                        : 0; // This will be a percentage value between 0 and 100

                    return monthSessions.length !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${completionRate}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {completionRate.toFixed(0)}%
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "dailyTotal":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForDay = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected day
                    let totalDurationForSelectedDay = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForDay = filterSessionsForDay(
                          task.sessions || []
                        );
                        totalDurationForSelectedDay +=
                          taskSessionsForDay.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const daySessions = task.sessions
                      ? filterSessionsForDay(task.sessions)
                      : [];
                    const taskTotalDuration =
                      daySessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalDurationForSelectedDay
                      : 0;

                    return taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(taskTotalDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );

          case "dailyAvgSession":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForDay = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedDay = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForDay = filterSessionsForDay(
                          task.sessions || []
                        );
                        totalDurationForSelectedDay +=
                          taskSessionsForDay.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const daySessions = task.sessions
                      ? filterSessionsForDay(task.sessions)
                      : [];
                    const taskTotalDuration =
                      daySessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const avgDuration =
                      daySessions.length > 0
                        ? taskTotalDuration / daySessions.length
                        : 0;

                    // Flex value based on average duration
                    const flexValue = avgDuration
                      ? avgDuration / totalDurationForSelectedDay // Assuming you have totalThisWeek calculated
                      : 0;

                    return avgDuration !== 0 && taskTotalDuration !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(avgDuration)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );

          case "dailyAvgBreaksPerSession":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForDay = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedDay = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForDay = filterSessionsForDay(
                          task.sessions || []
                        );
                        totalDurationForSelectedDay +=
                          taskSessionsForDay.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const daySessions = task.sessions
                      ? filterSessionsForDay(task.sessions)
                      : [];
                    const taskTotalDuration =
                      daySessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const totalBreaksForTask = daySessions.reduce(
                      (sum, session) => sum + (session.breaks || 0),
                      0
                    );
                    const avgBreaks =
                      daySessions.length > 0
                        ? totalBreaksForTask / daySessions.length
                        : 0;

                    const flexValue = avgBreaks
                      ? avgBreaks / totalBreaksForTask // Assuming you have totalThisWeek calculated
                      : 0;

                    return daySessions.length !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {avgBreaks.toFixed(1)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "dailyTimeSpentOnBreaks":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1); // set to the next day

                    const filterSessionsForDay = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedDay = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForDay = filterSessionsForDay(
                          task.sessions || []
                        );
                        totalDurationForSelectedDay +=
                          taskSessionsForDay.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const daySessions = task.sessions
                      ? filterSessionsForDay(task.sessions)
                      : [];
                    const taskTotalDuration =
                      daySessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const totalBreaksTimeThisDay = tasks.reduce(
                      (totalBreakTime, task) => {
                        const daySessions = task.sessions
                          ? task.sessions.filter((session: any) => {
                              const sessionDate = new Date(session.createdAt);
                              return (
                                sessionDate >= startDay &&
                                sessionDate < nextDayAfterEnd
                              );
                            })
                          : [];

                        return (
                          totalBreakTime +
                          daySessions.reduce(
                            (sum, session) =>
                              sum + (session.timeSpentOnBreaks || 0),
                            0
                          )
                        );
                      },
                      0
                    );

                    const totalTimeSpentOnBreaksForTask = daySessions.reduce(
                      (sum, session) => sum + (session.timeSpentOnBreaks || 0),
                      0
                    );

                    // For the flexValue calculation
                    const flexValue = totalTimeSpentOnBreaksForTask
                      ? totalTimeSpentOnBreaksForTask / totalBreaksTimeThisDay
                      : 0;

                    return daySessions.length !== 0 &&
                      totalTimeSpentOnBreaksForTask !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${flexValue * 100}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {formatDuration(totalTimeSpentOnBreaksForTask)}
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          case "dailyGoalCompletionRate":
            return (
              <>
                <Text
                  style={[
                    styles.title,
                    { color: theme["text-basic-color"], fontSize: 17 },
                  ]}
                >
                  {title}
                </Text>
                {tasks &&
                  tasks.map((task, index) => {
                    const startDay = new Date(start);
                    const nextDayAfterEnd = new Date(end);
                    startDay.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setHours(0, 0, 0, 0);
                    nextDayAfterEnd.setDate(nextDayAfterEnd.getDate() + 1);

                    const filterSessionsForDay = (taskSessions: any[]) => {
                      return taskSessions.filter((session: any) => {
                        const sessionDate = new Date(session.createdAt);
                        return (
                          sessionDate >= startDay &&
                          sessionDate < nextDayAfterEnd
                        );
                      });
                    };

                    // Calculate total duration for the selected month
                    let totalDurationForSelectedDay = 0;
                    if (tasks) {
                      tasks.forEach((task) => {
                        const taskSessionsForDay = filterSessionsForDay(
                          task.sessions || []
                        );
                        totalDurationForSelectedDay +=
                          taskSessionsForDay.reduce(
                            (sum, session) => sum + session.totalDuration,
                            0
                          );
                      });
                    }

                    const daySessions = task.sessions
                      ? filterSessionsForDay(task.sessions)
                      : [];
                    const taskTotalDuration =
                      daySessions.reduce(
                        (sum, session) => sum + session.totalDuration,
                        0
                      ) ?? 0;

                    const flexValue = taskTotalDuration
                      ? taskTotalDuration / totalDurationForSelectedDay
                      : 0;
                    //hi

                    // Get the count of sessions that meet or exceed the goal
                    const completedSessionsCount = daySessions.filter(
                      (session) => session.totalDuration >= task.goal
                    ).length;

                    // Calculate the goal completion rate
                    const completionRate =
                      daySessions.length > 0
                        ? (completedSessionsCount / daySessions.length) * 100
                        : 0; // This will be a percentage value between 0 and 100

                    return daySessions.length !== 0 ? (
                      <View key={index} style={[styles.taskContainer, {}]}>
                        <Text
                          style={[
                            styles.taskName,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {task.name}
                        </Text>
                        <View style={{ width: "100%", marginBottom: 3 }}>
                          <View
                            style={{
                              height: 20,
                              width: `${completionRate}%`,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: 5,
                            }}
                          ></View>
                        </View>

                        <Text
                          style={[
                            styles.taskDigit,
                            { color: theme["text-basic-color"] },
                          ]}
                        >
                          {completionRate.toFixed(0)}%
                        </Text>
                      </View>
                    ) : null;
                  })}
              </>
            );
          default:
            return <Text>Default option.</Text>;
        }
      })()}
    </View>
  );
};

export default GeneralCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 10,
  },

  title: {
    fontWeight: "700",
    marginBottom: 5,
  },
  taskContainer: {
    flexDirection: "column",
    paddingVertical: 5,
  },
  taskName: {
    marginBottom: 3,
    fontSize: 15,
  },
  taskDigit: {
    marginBottom: 0,
    fontSize: 13.5,
    alignSelf: "flex-end",
  },
  bar: {},
});
