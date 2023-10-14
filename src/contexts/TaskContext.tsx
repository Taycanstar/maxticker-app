// TaskContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  _id: any;
  name: string;
  goal: number;
  color: string;
  sessions?: any[];
  timerState?: "stopped" | "running" | "paused";
}

interface SessionData {
  startTime: number;
  totalDuration: number;
  status: string;
  laps: { time: number; name: string }[];
  history: any[];
  breaks: number;
  timeSpentOnBreaks: number;
}

type EndSessionFunction = (
  taskId: string,
  sessionData: SessionData
) => Promise<void>;

export interface TaskContextType {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  endSession: (taskId: string, sessionData: SessionData) => Promise<void>;
  handleTimer: (taskId: any, action: "start" | "pause" | "reset") => void;
  loading?: boolean;
}

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

const taskReducer = (state: Task[], action: any) => {
  switch (action.type) {
    case "SET_TASKS":
      return action.payload;
    case "UPDATE_TASK":
      return state.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
    case "ADD_TASK":
      return [...state, action.payload];
    case "DELETE_TASK":
      return state.filter((task) => task._id !== action.payload);
    case "UPDATE_TASK_PROPERTY":
      return state.map((task) =>
        task._id === action.payload.taskId
          ? { ...task, [action.payload.property]: action.payload.value }
          : task
      );
    default:
      return state;
  }
};

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
}: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [globalTimerState, setGlobalTimerState] = useState("stopped");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = await getTokenFromStorage();

      const response = await fetch(
        "https://maxticker-55df64f66a64.herokuapp.com/task/fetch-all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedTasks = await response.json();
      // setTasks(fetchedTasks);
      setTasks(
        fetchedTasks.map((task: Task) => ({ ...task, timerState: "stopped" }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const startTimer = (taskId: string) => {
    updateTaskProperty(taskId, "timerState", "running");
  };

  const pauseTimer = (taskId: string) => {
    updateTaskProperty(taskId, "timerState", "paused");
  };

  const resetTimer = (taskId: string) => {
    updateTaskProperty(taskId, "elapsedTime", 0);
    updateTaskProperty(taskId, "timerState", "stopped");
  };

  const updateElapsedTime = (taskId: string, elapsedTime: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, elapsedTime } : task
      )
    );
  };
  const handleTimer = (taskId: string, action: "start" | "pause" | "reset") => {
    if (action === "start") {
      startTimer(taskId);
    } else if (action === "pause") {
      pauseTimer(taskId);
    } else if (action === "reset") {
      resetTimer(taskId);
    }
  };

  const addTask = async (newTask: Task) => {
    try {
      const token = await getTokenFromStorage();
      const response = await fetch(
        "https://maxticker-55df64f66a64.herokuapp.com/task/new-task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        }
      );
      const savedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = await getTokenFromStorage();
      await fetch(
        `https://maxticker-55df64f66a64.herokuapp.com/task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.filter((task) => String(task._id) !== String(taskId))
      );
      console.log("task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const token = await getTokenFromStorage();
      await fetch(
        `https://maxticker-55df64f66a64.herokuapp.com/task/${updatedTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getTokenFromStorage = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (error) {
      console.error("Failed to get token from AsyncStorage:", error);
      return null;
    }
  };

  // ... [Your existing fetchTasks, addTask, deleteTask, and updateTask methods]

  const endSession: EndSessionFunction = async (id, sessionData) => {
    try {
      const token = await getTokenFromStorage();

      const response = await fetch(
        `https://maxticker-55df64f66a64.herokuapp.com/task/${id}/end-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sessionData), // Send the sessionData in the request body
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Error from server:", errorData.message);
      }
    } catch (error) {
      console.error("Error ending session:", error);
      // Again, optionally set some state or show a notification to the user
    }
  };

  const updateTaskProperty = (taskId: string, property: string, value: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, [property]: value } : task
      )
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        // setTasks,
        fetchTasks,
        addTask,
        deleteTask,
        updateTask,
        endSession,
        handleTimer,
        loading,
        // ... Add other session-related methods to the value prop as needed
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
