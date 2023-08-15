import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Text, Button, Layout, useTheme } from "@ui-kitten/components";
import { blackLogo } from "../../images/ImageAssets";
import Colors from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../navigation/AppNavigator";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { emailExists } from "../../store/user";
import CustomInput from "../../components/CustomInput";
import ErrorText from "../../components/ErrorText";
import CustomPasswordInput from "../../components/CustomPasswordInput";
type Props = {};

const LoginScreen: React.FC = () => {
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { navigate } = useNavigation<StackNavigation>();
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

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

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onContinuePress = () => {
    setLoading(true);
    if (isValidPassword(password)) {
      if (isValidEmail(email)) {
        dispatch(emailExists(email))
          .unwrap()
          .then((payload) => {
            navigate("Details", { email, password });
            console.log("success");
          })
          .catch((error) => {
            setIsError(true);
            setErrorText(error.message);
            setTimeout(() => {
              setIsError(false);
            }, 4000);
            console.log(`Error on Screen`, error.message);
          });
      } else {
        setIsError(true);
        setErrorText("Email is not valid");
        setTimeout(() => {
          setIsError(false);
        }, 4000);
        console.log(`Error on Screen`, "Email is not valid");
      }
    } else {
      setIsError(true);
      setErrorText("Password should be at least 8 characters long");
      setTimeout(() => {
        setIsError(false);
      }, 4000);
      console.log(`Error on Screen`, "Password is too short");
    }

    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  function isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
  };

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
            {
              backgroundColor: theme["background-basic-color-1"],
              zIndex: 2,
            },
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
                  Create a Humuli account
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
              <View style={{ width: "100%", marginTop: 10 }}>
                {isError && <ErrorText text={errorText} />}
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

    justifyContent: "space-between",
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
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
});
