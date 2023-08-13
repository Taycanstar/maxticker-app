import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
import { type StackNavigation } from "../../navigation/AppNavigator";
import CustomPasswordInput from "../../components/CustomPasswordInput";
import CustomInput from "../../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loginUser } from "../../store/user";
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

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onContinuePress = async () => {
    let action = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      return true;
    }
  };
  const onBackPress = () => {
    navigation.goBack();
  };
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
            style={{
              marginBottom: 25,
              marginTop: 10,
              width: "100%",
              alignItems: "flex-end",
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
    marginVertical: 10,
    width: "100%",
  },
  arrowContainer: {
    justifyContent: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
