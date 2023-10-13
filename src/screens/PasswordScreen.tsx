import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import Colors from "../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import CustomInput from "../components/CustomInput";
import CustomPasswordInput from "../components/CustomPasswordInput";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserById } from "../store/user";
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
      headerTitle: "Password",
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
});
