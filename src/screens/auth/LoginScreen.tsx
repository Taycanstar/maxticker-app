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
  ActivityIndicator,
  Keyboard,
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
import { blackLogo, whiteLogo } from "../../images/ImageAssets";
import Colors from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../navigation/AppNavigator";
import CustomPasswordInput from "../../components/CustomPasswordInput";
import CustomInput from "../../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loginUser, forgotPassword } from "../../store/user";
import ErrorText from "../../components/ErrorText";

type Props = {};

const LoginScreen: React.FC = () => {
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { navigate } = useNavigation<StackNavigation>();
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onForgotPress = async () => {
    navigate("ForgotPassword");
  };

  const onContinuePress = async () => {
    setLoading(true);
    let action = await dispatch(
      loginUser({
        email,
        password,
        productType: "Cronoverse",
      })
    );

    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      setLoading(false);
      return true;
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
      <Layout style={[styles.container, { backgroundColor: Colors.primary }]}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={whiteLogo} />
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
                  Log in with your Humuli account
                </Text>
              </View>

              <CustomInput
                placeholder="Email"
                textColor={theme["text-basic-color"]}
                bgColor={theme["input-background-color-1"]}
                borderColor={theme["input-border-color-1"]}
                onChange={(newText) => setEmail(newText)}
                autoCapitalize="none"
                value={email}
                inputMode="email"
                placeholderColor={theme["input-placeholder-color"]}
              />
              <CustomPasswordInput
                secureTextEntry={secureTextEntry}
                onChange={(nextValue) => setPassword(nextValue)}
                placeholder="Password"
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
              <View style={{ width: "100%" }}>
                {isError && (
                  <View style={{ width: "100%", marginTop: 10 }}>
                    <ErrorText text={errorText} />
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={onForgotPress}
                style={{
                  marginBottom: 25,
                  marginTop: 10,
                  // width: "100%",
                  alignSelf: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: theme["text-secondary-color"],
                    fontSize: 13,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <View
                style={[
                  styles.btnContainer,
                  { marginBottom: isKeyboardVisible ? 10 : 65, marginTop: 0 },
                ]}
              >
                <Button
                  status="success"
                  size="large"
                  style={{ borderRadius: 15 }}
                  onPress={onContinuePress}
                >
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    (evaProps) => (
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
                    )
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

export default LoginScreen;

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
    padding: 20,
  },
  logoContainer: {
    flex: 1, // This will take up all available space, pushing the card down
    justifyContent: "flex-start", // This will center the logo vertically
    alignItems: "center",
    paddingTop: 200,
  },
  logo: {
    width: 150,
    height: 150,
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
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
