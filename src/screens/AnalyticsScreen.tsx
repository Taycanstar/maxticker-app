import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
} from "react";
import Colors from "../constants/Colors";
import { Layout, useTheme } from "@ui-kitten/components";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import Feather from "@expo/vector-icons/Feather";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Circle, Svg, Line } from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  HomeScreenRouteProp,
  type StackNavigation,
} from "../navigation/AppNavigator";
import { useTasks, Task } from "../contexts/TaskContext";
import { useFocusEffect } from "@react-navigation/native";
import { blackLogo } from "../images/ImageAssets";
import { taskEventEmitter } from "../utils/eventEmitter";
import ModalComponent from "../components/ModalComponent";
type Props = {};

const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { navigate } = useNavigation<StackNavigation>();
  const [currentItem, setCurrentItem] = useState<string>("General");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const theme = useTheme();

  const onItemPress = () => {
    setIsModalVisible(!isModalVisible);
  };

  const items = [
    { name: "General", isPlus: false },
    { name: "Daily", isPlus: true },
    { name: "Weekly", isPlus: true },
    { name: "Monthly", isPlus: true },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <>
          <Image
            source={blackLogo}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </>
      ),

      headerTitleStyle: {
        color: theme["text-basic-color"],
        fontSize: 20,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={onItemPress}
          style={{
            paddingHorizontal: 15,
            flexDirection: "row",
            backgroundColor: theme["background-basic-color-1"],
          }}
        >
          <Text
            style={{
              color: theme["text-basic-color"],
              fontSize: 22,
              fontWeight: "500",
              marginRight: 5,
            }}
          >
            {currentItem}
          </Text>
          <Feather
            color={Colors.metagray2}
            size={20}
            name={isModalVisible ? "chevron-up" : "chevron-down"}
          />
        </TouchableOpacity>
      ),
      headerRight: null,
    });
  }, [isModalVisible]);
  return (
    <Layout
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <Text>StatsScreen</Text>
      <ModalComponent
        visible={isModalVisible}
        height={0.45}
        handlePress={onItemPress}
        onClose={() => setIsModalVisible(false)}
        items={items}
      />
    </Layout>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
