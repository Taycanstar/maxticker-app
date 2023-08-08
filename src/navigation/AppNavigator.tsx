import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "../screens/auth/AuthScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import DetailsScreen from "../screens/auth/DetailsScreen";
import VerifyScreen from "../screens/auth/VerifyScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import { useSelector } from "react-redux";
import {
  StackNavigationProp,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type Props = {};

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export type ScreenNames = ["Login", "Auth", "Signup", "Details", "Verify"];
export type RootStackParamList = {
  Login?: undefined;
  Auth?: undefined;
  Signup?: undefined;
  Details?: { email: string; password: string };
  Verify?: {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    birthday: string;
  };
};
export type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;
export type VerifyScreenRouteProp = RouteProp<RootStackParamList, "Verify">;

// export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = StackNavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
    </Stack.Navigator>
  );
};

const MainTab = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  // <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
  <Drawer.Navigator>
    <Drawer.Screen name="MainTab" component={MainTab} />
    {/* Add more screens in your main stack if needed */}
  </Drawer.Navigator>
);

const AppNavigator: React.FC<Props> = (Props: Props) => {
  const userStatus = useSelector((state: any) => state.user.status);
  return (
    <NavigationContainer>
      {userStatus === "loggedIn" ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
