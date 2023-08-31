// TaskContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  _id: any;
  name: string;
  goal: number;
  color: string;
  sessions?: any[];
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
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  endSession: (taskId: string, sessionData: SessionData) => Promise<void>;

  // ... Add other session-related methods as needed
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

export const TaskProvider: React.FC<TaskProviderProps> = ({
  children,
}: any) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchTasks = async () => {
    try {
      const token = await getTokenFromStorage();

      const response = await fetch("http://localhost:8000/task/fetch-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedTasks = await response.json();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (newTask: Task) => {
    try {
      const token = await getTokenFromStorage();
      const response = await fetch("http://localhost:8000/task/new-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      const savedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = await getTokenFromStorage();
      await fetch(`http://localhost:8000/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      await fetch(`http://localhost:8000/task/${updatedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
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
        `http://localhost:8000/task/${id}/end-session`,
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        fetchTasks,
        addTask,
        deleteTask,
        updateTask,
        endSession,
        // ... Add other session-related methods to the value prop as needed
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
