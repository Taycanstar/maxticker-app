import React, { useEffect, useState, useContext } from "react";
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
import AllScreen from "../screens/AllScreen";
import SetNewPasswordScreen from "../screens/auth/SetNewPasswordScreen";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Appearance,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
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
import MultipleScreen from "../screens/MultipleScreen";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Text, Dimensions } from "react-native";
import Plus from "../screens/suscription/Plus";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ColorScheme from "../screens/ColorScheme";
import SendFeedbackScreen from "../screens/SendFeedbackScreen";
import AboutScreen from "../screens/about/AboutScreen";
import Stopwatch from "../components/Stopwatch";
import { StackCardInterpolationProps } from "@react-navigation/stack";
import Add from "../components/Add";
import Edit from "../components/Edit";
import HomeScreen from "../screens/HomeScreen";
import DailyScreen from "../screens/DailyScreen";
import { getHeaderOptions } from "../utils/analyticsHeaderHelper";
import ModalComponent from "../components/ModalComponent";
import AnalyticsHeader from "../components/AnalyticsHeader";
import MonthlyScreen from "../screens/MonthlyScreen";
import WeeklyScreen from "../screens/WeeklyScreen";
import { ThemeContext } from "../utils/themeContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import ProfileScreen from "../screens/ProfileScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";
import EmailScreen from "../screens/EmailScreen";

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
  "Email",
  "Profile",
  "Daily",
  "PersonalInfo",
  "Monthly",
  "Weekly",
  "Add",
  "Login",
  "Auth",
  "Signup",
  "Details",
  "Verify",
  "Analytics",
  "History",
  "ConfirmOtp",
  "SetNewPassword",
  "Main",
  "Modal",
  "Edit",
  "Home",
  "Multiple",
  "Account"
];

export type RootStackParamList = {
  Account?: undefined;
  Email?: undefined;
  PersonalInfo?: undefined;
  Profile?: undefined;
  Daily?: undefined;
  Monthly?: undefined;
  Weekly?: undefined;
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
  Modal?: undefined;
  Main: {
    screen?: "Home" | "Multiple" | "Analytics";
  };
  Edit?: { name: string; goal?: number; color?: string };
  Home?: { updatedTask?: any };
  Multiple?: undefined;
  Subscription?: undefined;
};
export type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;
export type VerifyScreenRouteProp = RouteProp<RootStackParamList, "Verify">;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
export type SetNewPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  "SetNewPassword"
>;
export type ConfirmOtpScreenRouteProp = RouteProp<
  RootStackParamList,
  "ConfirmOtp"
>;

export type EditRouteProp = RouteProp<RootStackParamList, "Edit">;

// export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = StackNavigationProp<RootStackParamList>;

const Stack = createStackNavigator<RootStackParamList>();

const customCardStyleInterpolator = ({
  current,
  layouts,
}: StackCardInterpolationProps) => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0], // Change the second value to 0
      }),
    },
  };
};

function RootNavigator({ navigation }: any) {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // cardStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Add"
        component={Add}
        options={{
          headerShown: false,
          presentation: "modal",
          // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardStyleInterpolator: customCardStyleInterpolator,
        }}
      />
      <Stack.Screen
        name="Edit"
        component={Edit}
        options={{
          headerShown: false,
          presentation: "modal",
          cardStyleInterpolator: customCardStyleInterpolator,
        }}
      />
    </Stack.Navigator>
  );
}

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

const AccountStack = ({ navigation }: any) => {
  const theme = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: true,
          headerTitle: "Account",
          headerTintColor: theme["text-basic-color"],
          headerRight: () => null,
          headerStyle: {
            backgroundColor: theme["background-basic-color-1"],
            elevation: 0, // This removes the shadow for Android
            borderBottomWidth: 0,
            shadowOpacity: 0,
          },
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 10 }}
            >
              <Feather
                name="arrow-left"
                size={25}
                color={theme["text-basic-color"]}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="Email" component={EmailScreen} />
    </Stack.Navigator>
  );
};

type NavigationItem = {
  name: string;
  isPlus: boolean;
  nav: string;
};

const items: NavigationItem[] = [
  { name: "General", isPlus: false, nav: "Analytics" },
  { name: "Daily", isPlus: true, nav: "Daily" },
  { name: "Weekly", isPlus: true, nav: "Weekly" },
  { name: "Monthly", isPlus: true, nav: "Monthly" },
];

const AnalyticsStack = ({ navigation }: any) => {
  const { subscription, setSubscription } = useSubscription();
  const theme = useTheme();
  // const navigation = useNavigation();

  const [currentItem, setCurrentItem] = useState<string>("General");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleItemPress = (selectedItem: NavigationItem) => {
    if (subscription === "plus") {
      setCurrentItem(selectedItem.name);
      setIsModalVisible(!isModalVisible);
      navigation.navigate(selectedItem.nav);
    } else {
      navigation.navigate("Subscription");
      setIsModalVisible(!isModalVisible);
    }
  };

  return (
    <>
      <Stack.Navigator
        initialRouteName="Analytics"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme["background-basic-color-1"],
            elevation: 0, // This removes the shadow for Android
            borderBottomWidth: 0,
            shadowOpacity: 0,
          },
          animationEnabled: false,
          presentation: "card",
          cardStyle: {
            backgroundColor: theme["background-basic-color-1"], // This will set the background color for all screens
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          header: (props) => (
            <AnalyticsHeader
              {...props}
              theme={theme}
              isModalVisible={isModalVisible}
              onModalPress={() => {
                setIsModalVisible(!isModalVisible);
              }}
              currentItem={currentItem}
            />
          ),
        }}
      >
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="Daily" component={DailyScreen} />
        <Stack.Screen name="Monthly" component={MonthlyScreen} />
        <Stack.Screen name="Weekly" component={WeeklyScreen} />
      </Stack.Navigator>
      <ModalComponent
        visible={isModalVisible}
        height={0.45}
        handlePress={handleItemPress}
        onClose={() => setIsModalVisible(false)}
        items={items}
      />
    </>
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

const Clear = () => {
  return <View style={{ backgroundColor: "transparent" }} />;
};

const MainTab: React.FC<MainTabProps> = ({ navigation }) => {
  const theme = useTheme();
  const isDarkTheme = theme["background-basic-color-1"] === "#000";

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <GradientTabBar {...props} />}
        screenOptions={{
          lazy: false,
          headerShown: false,
          // tabBarShowLabel: false,
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
          name="Home"
          component={HomeScreen}
          options={({ route, navigation }) => ({
            headerShown: true,

            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => navigation.openDrawer()}
              >
                <Feather
                  name="menu"
                  size={25}
                  color={theme["text-basic-color"]}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: theme["background-basic-color-1"],
              elevation: 0, // This removes the shadow for Android
              borderBottomWidth: 0,
              shadowOpacity: 0,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Home");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Feather
                  name="home"
                  size={25}
                  color={focused ? theme["text-basic-color"] : "gray"}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Tab.Screen
          name="Multiple"
          component={MultipleScreen}
          options={({ route, navigation }) => ({
            headerShown: true,
            headerTitle: (props) => (
              <Image
                source={isDarkTheme ? whiteLogo : blackLogo}
                style={{ width: 60, height: 60 }}
                resizeMode="contain"
              />
            ),
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => navigation.openDrawer()}
              >
                <Feather
                  name="menu"
                  size={25}
                  color={theme["text-basic-color"]}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: theme["background-basic-color-1"],
              elevation: 0, // This removes the shadow for Android
              borderBottomWidth: 0,
              shadowOpacity: 0,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Multiple");
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
          name="Add "
          component={Clear} // Placeholder as the action is overridden
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // Prevent default action
              navigation.navigate("Add");
            },
          })}
          options={{
            headerShown: false,

            tabBarIcon: ({ color, size, focused }) => (
              <Feather
                name="plus-square"
                size={25}
                color={focused ? theme["text-basic-color"] : "gray"}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Analytics "
          component={AnalyticsStack}
          options={({ route, navigation }) => ({
            // tabBarVisible: getTabBarVisibility(route),
            headerShown: false,
            headerStyle: {
              backgroundColor: theme["background-basic-color-1"],
              elevation: 0, // This removes the shadow for Android
              borderBottomWidth: 0,
              shadowOpacity: 0,
            },

            tabBarIcon: ({ color, size, focused }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Analytics ");
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

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);
  const colorScheme = Appearance.getColorScheme();

  const items: any = [
    { name: "System", isPlus: false },
    { name: "Dark", isPlus: false },
    { name: "Light", isPlus: false },
  ];

  const handlePress = (routeName: string) => {
    if (routeName === "Color Scheme") {
      setIsModalVisible(true);
    }
  };

  const handleColorScheme = (item: any) => {
    if (item.name === "Dark" && themeContext.theme !== "dark") {
      themeContext.toggleTheme(); // This will toggle the theme
    } else if (item.name === "Light" && themeContext.theme !== "light") {
      themeContext.toggleTheme(); // This will toggle the theme
    } else if (item.name === "System") {
      themeContext.toggleTheme("system");
    }

    setIsModalVisible(false);
  };

  const { navigation } = props;
  return (
    <>
      <DrawerContentScrollView {...props}>
        {props.state.routes.map((route, index) => {
          if (route.name === "TabBar") return null;

          const focused = index === props.state.index;
          const { iconName } = route.params as { iconName: string };

          return (
            <CustomDrawerItem
              key={route.key}
              label={route.name}
              focused={focused}
              iconName={iconName}
              onPress={() => {
                if (route.name === "Color Scheme") {
                  handlePress(route.name);
                } else {
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </DrawerContentScrollView>
      <ModalComponent
        visible={isModalVisible}
        height={0.45}
        handlePress={handleColorScheme}
        onClose={() => setIsModalVisible(false)}
        items={items}
      />
    </>
  );
};

const MainStack = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const isDarkTheme = theme["background-basic-color-1"] === "#000";

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme["background-basic-color-1"],
          width: drawerWidth,
          shadowOpacity: 0,
        },
      }}
    >
      <Drawer.Screen
        name="TabBar"
        component={RootNavigator}
        options={{
          headerShown: false,
          headerTitle: (props) => (
            <Image
              source={isDarkTheme ? whiteLogo : blackLogo}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Account "
        component={AccountStack}
        initialParams={{ iconName: "user" }}
        // options={{
        //   headerShown: true,
        //   headerTitle: "Account",
        //   headerTintColor: theme["text-basic-color"],
        //   headerRight: () => null,
        //   headerStyle: {
        //     backgroundColor: theme["background-basic-color-1"],
        //     elevation: 0, // This removes the shadow for Android
        //     borderBottomWidth: 0,
        //     shadowOpacity: 0,
        //   },
        //   headerLeft: (props) => (
        //     <TouchableOpacity
        //       onPress={() => navigation.goBack()}
        //       style={{ paddingHorizontal: 10 }}
        //     >
        //       <Feather
        //         name="arrow-left"
        //         size={25}
        //         color={theme["text-basic-color"]}
        //       />
        //     </TouchableOpacity>
        //   ),
        // }}
      />

      <Drawer.Screen
        name="Subscription"
        component={Plus}
        initialParams={{ iconName: "check" }}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                color: theme["text-basic-color"],
                fontSize: 24,
                letterSpacing: 0.8,
                fontWeight: "bold",
              }}
            >
              Maxticker Plus
            </Text>
          ),
          headerTintColor: theme["text-basic-color"],
          headerRight: () => null,
          headerLeft: (props) => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 10 }}
            >
              <Feather
                name="arrow-left"
                size={25}
                color={theme["text-basic-color"]}
              />
            </TouchableOpacity>
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
