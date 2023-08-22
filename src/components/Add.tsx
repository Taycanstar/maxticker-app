import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Button,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useCallback } from "react";
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

type Props = {};

interface Color {
  name: string;
  color: string;
}

const Add: React.FC = ({ navigation }: any) => {
  const [name, setName] = useState<string>("");
  const [goal, setGoal] = useState<string>("Goal");
  const [colorOpen, setColorOpen] = useState<boolean>(false);
  const [goalOpen, setGoalOpen] = useState<boolean>(false);
  const [isPlusUser, setIsPlusUser] = useState<boolean>(true);
  const [isPickerShow, setIsPickerShow] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [color, setColor] = useState<string>("Stroke color");
  const { navigate } = useNavigation<StackNavigation>();

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const onChange = (event: any, value: any) => {
    if (value) {
      setSelectedTime(value);
    }
    // Note: You no longer set the goal here since you want to set it once the continue button is pressed
  };

  const onColorOpen = useCallback(() => {
    setColorOpen(false);
  }, []);
  const theme = useTheme();

  const [items, setItems] = useState([
    {
      label: "Blue",
      value: "blue",
      icon: () => <Feather color={theme["ios-blue"]} size={20} name="circle" />,
    },
    {
      label: "Red",
      value: "red",
      icon: () => <Feather color={theme["ios-red"]} size={20} name="circle" />,
    },
    {
      label: "Yellow",
      value: "yellow",
      icon: () => (
        <Feather color={theme["ios-yellow"]} size={20} name="circle" />
      ),
    },
    {
      label: "Green",
      value: "green",
      icon: () => (
        <Feather color={theme["ios-green"]} size={20} name="circle" />
      ),
    },
    {
      label: "Orange",
      value: "orange",
      icon: () => (
        <Feather color={theme["ios-orange"]} size={20} name="circle" />
      ),
    },
    {
      label: "Purple",
      value: "purple",
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

  return (
    <View style={{ flex: 1, backgroundColor: theme["box-bg"], paddingTop: 54 }}>
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
          style={[styles.centeredTitle, { color: theme["text-basic-color"] }]}
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
          {isModalVisible ? (
            <Feather color={Colors.metagray2} size={20} name="chevron-up" />
          ) : (
            <Feather color={Colors.metagray2} size={20} name="chevron-down" />
          )}
        </TouchableOpacity>

        <DropDownPicker
          placeholder={color === "Stroke color" ? "Stroke color" : undefined}
          value={color === "Stroke color" ? null : color}
          open={colorOpen}
          items={items}
          setOpen={setColorOpen}
          setValue={setColor}
          setItems={setItems}
          style={{
            backgroundColor: theme["background-basic-color-1"],
            borderColor: theme["pale-gray"],
            marginBottom: 10,
          }}
          textStyle={{
            fontSize: 15,
            paddingVertical: 11,
            paddingHorizontal: 6,
            color:
              color === "Stroke color"
                ? theme["input-placeholder-color"]
                : theme["text-basic-color"],
          }}
          listItemLabelStyle={{
            color: theme["text-basic-color"],
          }}
          listItemContainerStyle={{
            borderColor: theme["pale-gray"],
          }}
          dropDownContainerStyle={{
            backgroundColor: theme["background-basic-color-1"],
            borderColor: theme["pale-gray"],
          }}
          ArrowDownIconComponent={({ style }) => (
            <Feather color={Colors.metagray2} size={20} name="chevron-down" />
          )}
          ArrowUpIconComponent={({ style }) => (
            <Feather color={Colors.metagray2} size={20} name="chevron-up" />
          )}
          TickIconComponent={({ style }) => (
            <Feather color={Colors.metagray2} size={20} name="check" />
          )}
        />
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
                    display={Platform.OS === "android" ? "default" : "spinner"}
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
});
