import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
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

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onContinuePress = () => {
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
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  function isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  return (
    <Layout style={[styles.container, { backgroundColor: Colors.lightGreen }]}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={blackLogo} />
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: theme["background-basic-color-1"] },
        ]}
      >
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
              style={[styles.headerTxt, { color: theme["text-basic-color"] }]}
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
          <View style={{ width: "100%" }}>
            {isError && <ErrorText text={errorText} />}
          </View>

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

          <View style={styles.btnContainer}>
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
      </View>
    </Layout>
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
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  card: {
    flex: 0.5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
    marginVertical: 20,
    width: "100%",
  },
  arrowContainer: {
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
