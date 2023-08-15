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
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ConfirmOtpScreen from "../screens/auth/ConfirmOtpScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import AddScreen from "../screens/AddScreen";
import ExploreScreen from "../screens/ExploreScreen";
import SetNewPasswordScreen from "../screens/auth/SetNewPasswordScreen";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@ui-kitten/components";
import {
  StackNavigationProp,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import StatsScreen from "../screens/StatsScreen";
import Colors from "../constants/Colors";
import HistoryScreen from "../screens/HistoryScreen";
import { LinearGradient } from "expo-linear-gradient";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { blackLogo } from "../images/ImageAssets";
import * as Haptics from "expo-haptics";

export type Props = {};

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
type MainTabProps = {
  navigation: BottomTabNavigationProp<RootStackParamList>;
};

export type ScreenNames = [
  "Login",
  "Auth",
  "Signup",
  "Details",
  "Verify",
  "Add",
  "Explore",
  "Stats",
  "History",
  "ConfirmOtp",
  "SetNewPassword"
];
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
  Add?: undefined;
  Explore?: undefined;
  Stats?: undefined;
  History?: undefined;
  ForgotPassword?: undefined;
  ConfirmOtp?: {
    email: string;
  };
  SetNewPassword?: {
    email: string;
  };
};
export type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;
export type VerifyScreenRouteProp = RouteProp<RootStackParamList, "Verify">;
export type SetNewPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  "SetNewPassword"
>;
export type ConfirmOtpScreenRouteProp = RouteProp<
  RootStackParamList,
  "ConfirmOtp"
>;

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
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ConfirmOtp" component={ConfirmOtpScreen} />
      <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
    </Stack.Navigator>
  );
};

const MainTab: React.FC<MainTabProps> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme["text-basic-color"],
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={({ route }) => ({
          // tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Add");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather
                name="plus"
                size={25}
                color={focused ? theme["text-basic-color"] : "gray"}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={({ route }) => ({
          // tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Explore");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather
                name="search"
                size={25}
                color={focused ? theme["text-basic-color"] : "gray"}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={({ route }) => ({
          // tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("History");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather
                name="clipboard"
                size={25}
                color={focused ? theme["text-basic-color"] : "gray"}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={({ route }) => ({
          // tabBarVisible: getTabBarVisibility(route),
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Stats");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather
                name="bar-chart"
                size={25}
                color={focused ? theme["text-basic-color"] : "gray"}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const theme = useTheme();
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          backgroundColor: theme["background-basic-color-1"],
          padding: 10,
        }}
      >
        <Image source={blackLogo} style={{ width: 100, height: 100 }} />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const MainStack = () => {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      // drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme["background-basic-color-1"],
          width: 240,
        },
      }}
    >
      <Drawer.Screen name="Moodmotif" component={MainTab} />
    </Drawer.Navigator>
  );
};

const AppNavigator: React.FC<Props> = (Props: Props) => {
  const userStatus = useSelector((state: any) => state.user.status);
  return (
    <NavigationContainer>
      {userStatus === "loggedIn" ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
