import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  Button,
  Layout,
  Icon,
  IconElement,
  Input,
  IconProps,
  useTheme,
} from "@ui-kitten/components";
import { blackLogo } from "../../images/ImageAssets";
import Colors from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import {
  SetNewPasswordScreenRouteProp,
  type StackNavigation,
} from "../../navigation/AppNavigator";
import CustomPasswordInput from "../../components/CustomPasswordInput";
import CustomInput from "../../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { forgotPassword } from "../../store/user";
import ErrorText from "../../components/ErrorText";
import { Keyboard } from "react-native";

type Props = {};

type SetNewPasswordScreenProps = {
  route: SetNewPasswordScreenRouteProp;
};

const SetNewPasswordScreen: React.FC<SetNewPasswordScreenProps> = ({
  route,
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const { navigate } = useNavigation<StackNavigation>();
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  if (!route.params) {
    return null; // or any other fallback JSX/render
  }

  const { email } = route.params;

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onContinuePress = async () => {
    let action = await dispatch(forgotPassword(email));

    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      return true;
    } else {
      navigate("ConfirmOtp", { email });
    }
  };
  const onBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Layout
        style={[styles.container, { backgroundColor: Colors.lightGreen }]}
      >
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={blackLogo} />
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: theme["background-basic-color-1"] },
          ]}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.arrowContainer}>
              <Feather
                color={theme["text-basic-color"]}
                size={22}
                onPress={onBackPress}
                name="arrow-left"
              />
            </View>
            <View style={styles.wrapper}>
              <View style={styles.header}>
                <Text
                  style={[
                    styles.headerTxt,
                    { color: theme["text-basic-color"] },
                  ]}
                >
                  Reset your password
                </Text>
              </View>

              <View style={{ marginBottom: 25, paddingHorizontal: 65 }}>
                <Text
                  style={{
                    color: theme["text-secondary-color"],
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  Enter your email address and we will send you instructions to
                  reset your password.
                </Text>
              </View>

              <View style={{ width: "100%" }}>
                {isError && (
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <ErrorText text={errorText} />
                  </View>
                )}
              </View>

              <View
                style={[
                  styles.btnContainer,
                  { marginBottom: isKeyboardVisible ? 10 : 65, marginTop: 10 },
                ]}
              >
                <Button
                  status="success"
                  size="large"
                  style={{ borderRadius: 15 }}
                  onPress={onContinuePress}
                >
                  {(evaProps) => (
                    <Text
                      {...evaProps}
                      style={{
                        color: theme["success-btn-text"],
                        fontWeight: "600",
                        fontSize: 17,
                        letterSpacing: 0.25,
                      }}
                    >
                      Continue
                    </Text>
                  )}
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default SetNewPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  headerTxt: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  header: {
    paddingTop: 20,
    marginBottom: 10,
  },
  logoContainer: {
    flex: 1, // This will take up all available space, pushing the card down
    justifyContent: "flex-start", // This will center the logo vertically
    alignItems: "center",
    paddingTop: 200,
  },
  logo: {
    width: 100,
    height: 100,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    position: "absolute",
    paddingBottom: 10,
    bottom: 0,
  },
  wrapper: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  btn: {
    borderWidth: 2,
    borderRadius: 15,
  },
  signupBtnTxt: {},
  btnContainer: {
    width: "100%",
  },
  arrowContainer: {
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
