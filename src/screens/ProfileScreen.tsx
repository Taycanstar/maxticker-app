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

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const { navigate } = useNavigation<StackNavigation>();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [errorText, setErrorText] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const userId = userData?.data?.user?._id;
  const [data, setData] = useState(null);

  const [lastName, setLastName] = useState<any>("");
  const [name, setName] = useState<any>("");

  const onSave = async () => {
    let action = await dispatch(
      editProfile({ firstName: name, lastName, id: userId })
    );

    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      return true;
    } else {
      navigation.navigate("Home");
    }

    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Profile",
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
  }, [name, lastName]);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/get-user-by-id/${userId}`);
        if (mounted) {
          setData(data);
          setName(data.firstName);
          setLastName(data.lastName);

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
          placeholder="First name"
          textColor={theme["text-basic-color"]}
          bgColor={theme["input-background-color-1"]}
          borderColor={theme["input-border-color-1"]}
          onChange={(newText) => setName(newText)}
          autoCapitalize="none"
          value={name}
          inputMode="text"
          placeholderColor={theme["input-placeholder-color"]}
        />
        <CustomInput
          placeholder="Last name"
          textColor={theme["text-basic-color"]}
          bgColor={theme["input-background-color-1"]}
          borderColor={theme["input-border-color-1"]}
          onChange={(newText) => setLastName(newText)}
          autoCapitalize="none"
          value={lastName}
          inputMode="text"
          placeholderColor={theme["input-placeholder-color"]}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
