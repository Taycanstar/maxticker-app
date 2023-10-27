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
import { changeMfPassword } from "../store/user";
import axios from "axios";
import api from "../api";
import ErrorText from "../components/ErrorText";

const ChangePassword: React.FC = ({ navigation }: any) => {
  const { navigate } = useNavigation<StackNavigation>();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [errorText, setErrorText] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: any) => state.user);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [secureTextEntryOld, setSecureTextEntryOld] = useState<boolean>(true);
  const userId = userData?.data?.user?._id;
  const [oldPassword, setOldPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onSave = async () => {
    // console.log("Sending request with:", oldPassword, password, userId);

    let action = await dispatch(
      changeMfPassword({ oldPassword, password, id: userId })
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
      headerTitle: "Change Password",
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
  }, []);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const toggleSecureEntryOld = (): void => {
    setSecureTextEntryOld(!secureTextEntryOld);
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme["background-basic-color-1"], flex: 1 }}
    >
      <View style={{ paddingVertical: 15 }}>
        <View style={{ marginVertical: 5 }}>
          <CustomPasswordInput
            secureTextEntry={secureTextEntryOld}
            onChange={(nextValue) => setOldPassword(nextValue)}
            placeholder="Current password"
            textColor={theme["text-basic-color"]}
            bgColor={theme["input-background-color-1"]}
            borderColor={theme["input-border-color-1"]}
            autoCapitalize="none"
            value={oldPassword}
            placeholderColor={theme["input-placeholder-color"]}
            onPress={toggleSecureEntryOld}
            isPasswordVisible={!secureTextEntryOld}
            maxLength={28}
          />
        </View>

        <View style={{ marginTop: 25 }}>
          <CustomPasswordInput
            secureTextEntry={secureTextEntry}
            onChange={(nextValue) => setPassword(nextValue)}
            placeholder="New password"
            textColor={theme["text-basic-color"]}
            bgColor={theme["input-background-color-1"]}
            borderColor={theme["input-border-color-1"]}
            autoCapitalize="none"
            value={password}
            placeholderColor={theme["input-placeholder-color"]}
            onPress={toggleSecureEntry}
            isPasswordVisible={!secureTextEntry}
            maxLength={28}
          />
        </View>
        <View style={{ width: "100%", marginTop: 25 }}>
          {isError && (
            <View style={{ width: "100%", marginTop: 10 }}>
              <ErrorText text={errorText} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
