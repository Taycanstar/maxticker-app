import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";
import Colors from "../constants/Colors";
import { useTheme } from "@ui-kitten/components";
import { blackLogo, whiteLogo } from "../images/ImageAssets";
import { Card, Layout } from "@ui-kitten/components";
import CustomInput from "./CustomInput";
import DropDownPicker from "react-native-dropdown-picker";
import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../navigation/AppNavigator";
import { TaskContext } from "../contexts/TaskContext";
import uuid from "react-native-uuid";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useSelector } from "react-redux";

type Props = {};

interface Color {
  name: string;
  color: string;
}

const Add: React.FC = ({ navigation }: any) => {
  const { subscription, setSubscription, isLoading } = useSubscription();
  const theme = useTheme();
  const initialTime = new Date();
  initialTime.setHours(0);
  initialTime.setMinutes(0);
  const [name, setName] = useState<string>("");
  const [goal, setGoal] = useState<string>("Goal");
  const [goalTime, setGoalTime] = useState<number>(0);
  const [colorOpen, setColorOpen] = useState<boolean>(false);
  const [goalOpen, setGoalOpen] = useState<boolean>(false);
  const [isPlusUser, setIsPlusUser] = useState<boolean>(true);
  const [isPickerShow, setIsPickerShow] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [color, setColor] = useState<string>("Stroke color");
  const [colorValue, setColorValue] = useState<string>(theme["ios-blue"]);
  const { navigate } = useNavigation<StackNavigation>();
  const [isStrokeVisible, setIsStrokeVisible] = useState<boolean>(false);
  const context = useContext(TaskContext);
  const userData = useSelector((state: any) => state.user);

  if (!context) {
    throw new Error("AddScreen must be used within a TaskProvider");
  }

  const { addTask } = context;

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event: any, value: any) => {
    if (value) {
      setSelectedTime(value);
    }
    const hours = value.getHours();
    const minutes = value.getMinutes();

    // Convert hours and minutes to seconds
    const totalSeconds = convertToMilliseconds(hours, minutes);
    setGoalTime(totalSeconds);
  };

  const onColorOpen = useCallback(() => {
    setColorOpen(false);
  }, []);

  const [items, setItems] = useState([
    {
      label: "Blue",
      value: "blue",
      color: theme["ios-blue"],
      iconName: "circle",
      icon: () => <Feather color={theme["ios-blue"]} size={20} name="circle" />,
    },
    {
      label: "Red",
      value: "red",
      color: theme["ios-red"],
      iconName: "circle",
      icon: () => <Feather color={theme["ios-red"]} size={20} name="circle" />,
    },
    {
      label: "Yellow",
      value: "yellow",
      color: theme["ios-yellow"],
      iconName: "circle",
      icon: () => (
        <Feather color={theme["ios-yellow"]} size={20} name="circle" />
      ),
    },
    {
      label: "Green",
      value: "green",
      color: theme["ios-green"],
      iconName: "circle",
      icon: () => (
        <Feather color={theme["ios-green"]} size={20} name="circle" />
      ),
    },
    {
      label: "Orange",
      value: "orange",
      color: theme["ios-orange"],
      iconName: "circle",
      icon: () => (
        <Feather color={theme["ios-orange"]} size={20} name="circle" />
      ),
    },
    {
      label: "Purple",
      value: "purple",
      color: theme["ios-purple"],
      iconName: "circle",
      icon: () => (
        <Feather color={theme["ios-purple"]} size={20} name="circle" />
      ),
    },
  ]);

  const formatSelectedTime = (date: Date): string => {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    return `${hours}h ${minutes}min`;
  };

  const onContinuePress = () => {
    setIsModalVisible(!isModalVisible);
    setGoal(formatSelectedTime(selectedTime));
  };

  const onCancelPress = () => {
    navigation.goBack();
  };

  const onColorPress = (color: any) => {
    setIsStrokeVisible(!isStrokeVisible);
    setColor(color.label);
    setColorValue(color.color);
  };

  const handleAddTask = async () => {
    const newTask = {
      _id: uuid.v4(), // You'll need to define this function or use another method to generate a unique ID for each task
      name: name, // Assuming 'name' is a state variable in your component
      goal: goalTime,
      color: colorValue,
      sessions: [],
    };
    try {
      await addTask(newTask);
      console.log("success");
      setTimeout(() => {
        navigate("Main", { screen: "Home" });
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  const convertToMilliseconds = (hours: number, minutes: number): number => {
    return (hours * 60 * 60 + minutes * 60) * 1000;
  };

  const effectiveSubscription =
    isLoading || subscription === null
      ? userData?.data?.user?.subscription
      : subscription;

  const handleColor = () => {
    if (effectiveSubscription == "standard") {
      navigation.navigate("Subscription");
    } else if (effectiveSubscription == "plus") {
      setIsStrokeVisible(!isStrokeVisible);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme["box-bg"], paddingTop: 54 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: theme["background-basic-color-1"],
          }}
          keyboardShouldPersistTaps="always" // This is the key
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: theme["box-bg"],
              },
            ]}
          >
            <TouchableOpacity
              style={{ position: "relative", zIndex: 10 }}
              onPress={onCancelPress}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: theme["text-basic-color"],
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.centeredTitle,
                { color: theme["text-basic-color"] },
              ]}
            >
              NewTask
            </Text>
          </View>

          <View
            style={[
              styles.content,
              { backgroundColor: theme["background-basic-color-1"] },
            ]}
          >
            <CustomInput
              placeholder="Name"
              borderColor={theme["pale-gray"]}
              onChange={(text) => setName(text)}
              textColor={theme["text-basic-color"]}
              placeholderColor={theme["input-placeholder-color"]}
              autoFocus={true}
            />

            <TouchableOpacity
              onPress={() => setIsModalVisible(!isModalVisible)}
              style={{
                flexDirection: "row",
                width: "100%",
                minHeight: 48,
                borderRadius: 10,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: theme["background-basic-color-1"],
                borderColor: theme["pale-gray"],
                paddingVertical: 11,
                paddingLeft: 16,
                marginBottom: 10,
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  color:
                    goal === "Goal"
                      ? theme["input-placeholder-color"]
                      : theme["text-basic-color"],

                  fontSize: 15,
                }}
              >
                {goal}
              </Text>

              <Feather
                color={Colors.metagray2}
                size={20}
                name={isModalVisible ? "chevron-up" : "chevron-down"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleColor}
              style={{
                flexDirection: "row",
                width: "100%",
                minHeight: 48,
                borderRadius: 10,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: theme["background-basic-color-1"],
                borderColor: theme["pale-gray"],
                paddingVertical: 11,
                paddingLeft: 16,
                marginBottom: 10,
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  color:
                    color === "Stroke color"
                      ? theme["input-placeholder-color"]
                      : theme["text-basic-color"],

                  fontSize: 15,
                }}
              >
                {color}
              </Text>
              {effectiveSubscription === "standard" ? (
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      backgroundColor: theme["ios-blue"],
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      borderRadius: 5,
                      marginHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      PLUS
                    </Text>
                  </View>
                  <Feather
                    color={Colors.metagray2}
                    size={20}
                    name="chevron-right"
                  />
                </View>
              ) : (
                <Feather
                  color={Colors.metagray2}
                  size={20}
                  name={isStrokeVisible ? "chevron-up" : "chevron-down"}
                />
              )}
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              setIsModalVisible(!isModalVisible);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      justifyContent: "space-between",
                      backgroundColor: theme["box-bg"],
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                  >
                    <View
                      style={[
                        styles.modalView,
                        { backgroundColor: theme["box-bg"] },
                      ]}
                    >
                      <Text
                        style={{
                          color: theme["text-basic-color"],
                          fontSize: 22,
                          fontWeight: "600",
                          // textAlign: "center",
                        }}
                      >
                        Goal
                      </Text>
                      <DateTimePicker
                        textColor={theme["text-basic-color"]}
                        value={selectedTime}
                        mode={"time"}
                        is24Hour={false}
                        locale="en_GB"
                        display={
                          Platform.OS === "android" ? "default" : "spinner"
                        }
                        onChange={onChange}
                      />
                    </View>
                    <View style={{ paddingBottom: 30, marginHorizontal: 15 }}>
                      <CustomButton
                        text="Continue"
                        textColor="white"
                        bgColor={theme["ios-blue"]}
                        borderColor={theme["pale-gray"]}
                        onPress={onContinuePress}
                        fontWeight={"600"}
                        fontSize={18}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isStrokeVisible}
            onRequestClose={() => {
              setIsStrokeVisible(!isStrokeVisible);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setIsStrokeVisible(false)}>
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      justifyContent: "space-between",
                      backgroundColor: theme["box-bg"],
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                  >
                    <View
                      style={[
                        styles.modalView2,
                        { backgroundColor: theme["box-bg"] },
                      ]}
                    >
                      <Text
                        style={{
                          color: theme["text-basic-color"],
                          fontSize: 22,
                          fontWeight: "600",
                          // textAlign: "center",
                        }}
                      >
                        Stroke color
                      </Text>
                      {items.map((color, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => onColorPress(color)}
                            key={index}
                            style={{
                              flexDirection: "row",
                              marginTop: 30,
                              alignItems: "center",
                            }}
                          >
                            <Feather
                              color={color.color}
                              size={20}
                              name="circle"
                            />
                            <Text
                              style={{
                                color: theme["text-basic-color"],
                                fontSize: 18,
                                fontWeight: "400",
                                marginLeft: 20,
                              }}
                            >
                              {color.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>

        <View
          style={{
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-end",

            paddingHorizontal: 10,
            paddingVertical: 20,
            backgroundColor: theme["background-basic-color-1"],
          }}
        >
          <TouchableOpacity
            disabled={name === "" ? true : false}
            style={{ alignSelf: "flex-end" }}
            onPress={handleAddTask}
          >
            <Text
              style={{
                color: name === "" ? theme["ios-bluelight"] : theme["ios-blue"],
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 15,
    // alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    paddingBottom: 13,
  },
  centeredTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end", // Aligns the modal to the bottom
    backgroundColor: "rgba(0,0,0,0.5)", // Dimmed background
  },
  modalView: {
    width: "100%", // Full width
    height: Dimensions.get("window").height * 0.4, // 65% height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    width: "100%", // Full width
    height: Dimensions.get("window").height * 0.6, // 65% height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
