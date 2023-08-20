import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "../screens/auth/AuthScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import DetailsScreen from "../screens/auth/DetailsScreen";
import AccountScreen from "../screens/account/AccountScreen";
import VerifyScreen from "../screens/auth/VerifyScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ConfirmOtpScreen from "../screens/auth/ConfirmOtpScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import AddScreen from "../screens/ActiveScreen";
import AllScreen from "../screens/AllScreen";
import SetNewPasswordScreen from "../screens/auth/SetNewPasswordScreen";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@ui-kitten/components";
import {
  StackNavigationProp,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import Colors from "../constants/Colors";
import HistoryScreen from "../screens/HistoryScreen";
import { LinearGradient } from "expo-linear-gradient";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { blackLogo, whiteLogo } from "../images/ImageAssets";
import * as Haptics from "expo-haptics";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import ActiveScreen from "../screens/ActiveScreen";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Text, Dimensions } from "react-native";
import Plus from "../screens/suscription/Plus";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ColorScheme from "../screens/ColorScheme";
import SendFeedbackScreen from "../screens/SendFeedbackScreen";
import AboutScreen from "../screens/about/AboutScreen";
import Stopwatch from "../components/Stopwatch";

export type Props = {};
type DrawerRouteProp = RouteProp<DrawerRouteParams, DrawerRoutes>;

const screenWidth = Dimensions.get("window").width;
const drawerWidth = screenWidth * 0.8;

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
type MainTabProps = {
  navigation: BottomTabNavigationProp<RootStackParamList>;
};

type DrawerRouteParams = {
  TabBar?: { icon?: string };
  Account?: { icon?: string };
  Subscription?: { icon?: string };
  // Add other screens here if needed...
};

type DrawerRoutes = keyof DrawerRouteParams;

export type ScreenNames = [
  "Add",
  "Login",
  "Auth",
  "Signup",
  "Details",
  "Verify",
  "Active",
  "All",
  "Analytics",
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
  Active?: undefined;
  All?: undefined;
  Analytics?: undefined;
  History?: undefined;
  ForgotPassword?: undefined;
  ConfirmOtp?: {
    email: string;
  };
  SetNewPassword?: {
    email: string;
  };
  Add?: undefined;
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

const GradientTabBar = (props: any) => {
  const theme = useTheme();
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* Gradient Background */}
      <View
        style={{
          height: 150,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
        }}
      >
        <LinearGradient
          colors={[
            theme["gradient-1"],
            theme["gradient-2"],
            theme["gradient-3"],
            theme["gradient-4"],
          ]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Tabs */}
      <BottomTabBar
        {...props}
        style={{ backgroundColor: "transparent", borderTopWidth: 0 }}
      />
    </View>
  );
};

const ActiveScreenStack = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Singular" },
    { key: "second", title: "Multiple" },
  ]);

  const theme = useTheme();

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        first: ActiveScreen,
        second: Stopwatch,
      })}
      onIndexChange={setIndex}
      initialLayout={{ width: 400 }} // adjust according to your needs
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: theme["text-basic-color"] }}
          style={{
            backgroundColor: theme["background-basic-color-1"],
          }} // Adjust to your theme
          labelStyle={{
            color: theme["text-basic-color"], // Add this line to change the text color
          }}
          renderLabel={({ route, focused, color }) => (
            <Text
              style={{
                color,
                opacity: focused ? 1 : 0.5,
                fontSize: 16,
                fontWeight: "600",
                letterSpacing: 0.2,
              }}
            >
              {route.title}
            </Text>
          )}
        />
      )}
    />
  );
};
const MainTab: React.FC<MainTabProps> = ({ navigation }) => {
  const theme = useTheme();

  const backgroundColor =
    theme["background-basic-color-1"] === "#000"
      ? "rgba(0, 0, 0, 0.1)"
      : "rgba(255, 255, 255, 0.1)";

  const midBackgroundColor =
    theme["background-basic-color-1"] === "#000"
      ? "rgba(0, 0, 0, 0.05)"
      : "rgba(255, 255, 255, 0.05)";

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <GradientTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme["text-basic-color"],
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            position: "absolute",
            // height: 100,
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={[
                theme["gradient-1"],
                theme["gradient-2"],
                theme["gradient-3"],
                theme["gradient-4"],
              ]}
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Tab.Screen
          name="Active"
          component={ActiveScreenStack}
          options={({ route }) => ({
            // tabBarVisible: getTabBarVisibility(route),
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Active");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Feather
                  name="clock"
                  size={25}
                  color={focused ? theme["text-basic-color"] : "gray"}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Tab.Screen
          name="All"
          component={AllScreen}
          options={({ route }) => ({
            // tabBarVisible: getTabBarVisibility(route),
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("All");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Feather
                  name="list"
                  size={25}
                  color={focused ? theme["text-basic-color"] : "gray"}
                />
              </TouchableOpacity>
            ),
          })}
        />
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
          name="Analytics"
          component={AnalyticsScreen}
          options={({ route }) => ({
            // tabBarVisible: getTabBarVisibility(route),
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Analytics");
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
    </>
  );
};

const CustomDrawerItem: React.FC<{
  label: string;
  iconName?: any;
  focused: boolean;
  onPress: () => void;
}> = ({ label, iconName, focused, onPress }) => {
  const theme = useTheme();
  const color = focused ? theme["text-basic-color"] : theme["text-basic-color"];
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={{ flexDirection: "row" }}>
        {iconName && (
          <Feather name={iconName} size={20} color={Colors.lightergray} />
        )}
        <Text style={{ color, marginLeft: 15, fontSize: 16 }}>{label}</Text>
      </View>

      <Feather name="arrow-right" size={25} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const theme = useTheme();
  return (
    <DrawerContentScrollView {...props}>
      {props.state.routes.map((route, index) => {
        if (route.name === "TabBar") return null; // Skip rendering the TabBar

        const focused = index === props.state.index;
        const { iconName } = route.params as { iconName: string };

        const color = focused
          ? theme["text-basic-color"]
          : theme["text-basic-color"];
        return (
          <CustomDrawerItem
            key={route.key}
            label={route.name}
            focused={focused}
            iconName={iconName}
            onPress={() => props.navigation.navigate(route.name)}
          />
        );
      })}
    </DrawerContentScrollView>
  );
};

const MainStack = () => {
  const theme = useTheme();
  const isDarkTheme = theme["background-basic-color-1"] === "#000";
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        // headerShown: false,
        drawerStyle: {
          backgroundColor: theme["background-basic-color-1"],
          width: drawerWidth,
          shadowOpacity: 0,
        },
      }}
    >
      <Drawer.Screen
        name="TabBar"
        component={MainTab}
        options={{
          headerTitle: (props) => (
            <Image
              source={isDarkTheme ? whiteLogo : blackLogo}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          ),
          headerStyle: {
            backgroundColor: theme["background-basic-color-1"],
            elevation: 0, // This removes the shadow for Android
            borderBottomWidth: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        initialParams={{ iconName: "user" }}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Suscription"
        component={Plus}
        initialParams={{ iconName: "check" }}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        initialParams={{ iconName: "bell" }}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Color Scheme"
        component={ColorScheme}
        initialParams={{ iconName: "loader" }}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Send feedback"
        component={SendFeedbackScreen}
        initialParams={{ iconName: "message-square" }}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        initialParams={{ iconName: "info" }}
        options={{
          headerShown: false,
        }}
      />
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
