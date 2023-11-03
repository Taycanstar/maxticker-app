import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import Colors from "../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import CustomInput from "../components/CustomInput";
import CustomPasswordInput from "../components/CustomPasswordInput";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, fetchUserById, logoutUser } from "../store/user";
import { AppDispatch } from "../store";
import { StackNavigation } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { editProfile, getUserById } from "../store/user";
import axios from "axios";
import api from "../api";

const PasswordScreen: React.FC = ({ navigation }: any) => {
  const { navigate } = useNavigation<StackNavigation>();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [errorText, setErrorText] = useState("");
  const [isError, setIsError] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const userId = userData?.data?.user?._id;
  const [data, setData] = useState(null);

  const [email, setEmail] = useState<any>("");
  const [birthday, setBirthday] = useState<any>("");
  const [password, setPassword] = useState<any>("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Security",
      headerTintColor: theme["text-basic-color"],

      headerStyle: {
        backgroundColor: theme["background-basic-color-1"],
        elevation: 0, // This removes the shadow for Android
        borderBottomWidth: 0,
        shadowOpacity: 0,
      },
      headerLeft: () => (
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

      headerRight: () => null,
    });
  }, [email, birthday]);

  const onDelete = async () => {
    const action = await dispatch(deleteUser(userId));

    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      setIsDeleteVisible(false);
      return true;
    } else {
      console.log("success subscription cancelled");
      const action = await dispatch(logoutUser);
      setIsDeleteVisible(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/get-user-by-id/${userId}`);
        if (mounted) {
          setData(data);
          setEmail(data.email);
          setBirthday(data.birthday);

          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView
      style={{ backgroundColor: theme["background-basic-color-1"], flex: 1 }}
    >
      <View
        style={{
          paddingVertical: 15,
          backgroundColor: theme["card-bg"],
          borderRadius: 12,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigate("ChangePassword")}
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            // paddingVertical: 10,
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0,
            paddingVertical: 2.5,
            borderBottomColor: theme["border-gray"],
          }}
        >
          <View>
            <Text
              style={{
                color: theme["text-basic-color"],
                fontWeight: "700",
                marginBottom: 3,
              }}
            >
              Change password
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={theme["text-basic-color"]}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          paddingVertical: 15,
          backgroundColor: theme["card-bg"],
          borderRadius: 12,
          justifyContent: "center",
          marginVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setIsDeleteVisible(true)}
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,

            justifyContent: "space-between",

            alignItems: "center",
            borderBottomWidth: 0,
            paddingVertical: 2.5,
            borderBottomColor: theme["border-gray"],
          }}
        >
          <View>
            <Text
              style={{
                color: theme["ios-red"],
                fontWeight: "700",
                marginBottom: 3,
              }}
            >
              Delete account
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={20}
            color={theme["text-basic-color"]}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteVisible}
        onRequestClose={() => {
          setIsDeleteVisible(!isDeleteVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setIsDeleteVisible(false)}>
          <View style={styles.deleteOverlay}>
            <View style={styles.centeredViewDel}>
              <View
                style={[
                  styles.modalViewDel,
                  { backgroundColor: theme["btn-bg"] },
                ]}
              >
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: theme["text-basic-color"],
                      textAlign: "center",
                      marginVertical: 15,
                    },
                  ]}
                >
                  Delete task
                </Text>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: theme["text-basic-color"],
                      fontWeight: "400",
                      paddingHorizontal: 30,
                      fontSize: 14,
                      marginBottom: 15,
                    },
                  ]}
                >
                  Are you sure you want to delete this task permanently?
                </Text>

                <TouchableOpacity
                  onPress={onDelete}
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme["btn-bg"],
                      borderColor: theme["border-gray"],
                    },
                  ]}
                >
                  <Text
                    style={[styles.textStyle, { color: theme["meta-red"] }]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme["btn-bg"],
                      borderColor: theme["border-gray"],
                      paddingBottom: 0,
                    },
                  ]}
                  onPress={() => setIsDeleteVisible(false)}
                >
                  <Text
                    style={[
                      styles.textStyle,
                      { color: theme["text-basic-color"], fontWeight: "400" },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  centeredViewDel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  modalViewDel: {
    width: "80%",

    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 15,
  },
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
    paddingVertical: 15,
    borderTopWidth: 0.5,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  textStyle2: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  deleteOverlay: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // semi-transparent background
  },
});
