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
import { changeEmail, fetchUserById } from "../store/user";
import { AppDispatch } from "../store";
import { StackNavigation } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { editProfile, getUserById } from "../store/user";
import api from "../api";

const EmailScreen: React.FC = ({ navigation }: any) => {
  const { navigate } = useNavigation<StackNavigation>();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [errorText, setErrorText] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const userId = userData?.data?.user?._id;
  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");

  const onSave = async () => {
    let action = await dispatch(changeEmail({ email: email, id: userId }));

    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      return true;
    } else {
      navigation.navigate("Home");
      console.log("worked");
    }

    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Email",
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

      headerRight: () => (
        <TouchableOpacity onPress={onSave} style={{ paddingHorizontal: 15 }}>
          <Text style={{ color: theme["text-basic-color"], fontSize: 17 }}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [email]);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/get-user-by-id/${userId}`);
        if (mounted) {
          setData(data);
          setEmail(data.email);
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
      <View style={{ paddingVertical: 15 }}>
        <CustomInput
          placeholder="Email"
          textColor={theme["text-basic-color"]}
          bgColor={theme["input-background-color-1"]}
          borderColor={theme["input-border-color-1"]}
          onChange={(newText) => setEmail(newText)}
          autoCapitalize="none"
          value={email}
          inputMode="text"
          placeholderColor={theme["input-placeholder-color"]}
        />
      </View>
    </SafeAreaView>
  );
};

export default EmailScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
