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
import React, { useState, useEffect, useCallback } from "react";
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
import {
  VerifyScreenRouteProp,
  type StackNavigation,
} from "../../navigation/AppNavigator";
import CustomInput from "../../components/CustomInput";
import {
  confirmPhoneNumber,
  signup,
  loginUser,
  resendCode,
} from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import ErrorText from "../../components/ErrorText";

type Props = {};

type VerifyScreenProps = {
  route: VerifyScreenRouteProp;
};

const VerifyScreen: React.FC<VerifyScreenProps> = ({ route }) => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { navigate } = useNavigation<StackNavigation>();
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch<AppDispatch>();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [codePlaceholder, setCodePlaceholder] = useState<string>("Enter code");
  const theme = useTheme();
  const [resend, setResend] = useState<string>("Resend");

  if (!route.params) {
    return null; // or any other fallback JSX/render
  }
  const { email, password, firstName, lastName, phoneNumber, birthday } =
    route.params;
  useEffect(() => {
    if (code && code.length === 6) {
      onSubmit();
    }
  }, [code]);

  const handleActionError = (action: any) => {
    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      return true;
    }
    return false;
  };

  const onSubmit = useCallback(async () => {
    setLoading(true);

    let action = await dispatch(
      confirmPhoneNumber({
        phoneNumber,
        otpCode: code,
      })
    );

    if (handleActionError(action)) return;

    const action2 = await dispatch(
      signup({
        password,
        email,
        phoneNumber,
        birthday,
        firstName,
        lastName,
        productType: "Cronoverse",
      })
    );

    if (handleActionError(action2)) return;
    setLoading(false);

    // Add any further logic if needed
  }, [code, email, password, phoneNumber, birthday, firstName, lastName]); // make sure to include all dependencies used within the callback

  const onResend = async () => {
    setResend("Sent.");
    const res = await dispatch(resendCode(phoneNumber));
    if (handleActionError(res)) return;
    setTimeout(() => setResend("Resend"), 15000);
  };
  const onBackPress = () => {
    navigation.goBack();
  };
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
                  Verify your phone number
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
                  Enter the code that was sent to your phone number.
                </Text>
              </View>

              <CustomInput
                placeholder={codePlaceholder}
                textColor={theme["text-basic-color"]}
                bgColor={theme["input-background-color-1"]}
                borderColor={theme["input-border-color-1"]}
                onChange={(newText) => setCode(newText)}
                autoCapitalize="none"
                value={code}
                inputMode="numeric"
                placeholderColor={theme["input-placeholder-color"]}
                onFocus={() => setCodePlaceholder("000000")}
                onBlur={() => setCodePlaceholder("Enter code")}
              />
              <View style={{ width: "100%" }}>
                {isError && <ErrorText text={errorText} />}
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (resend === "Resend") {
                    onResend();
                  }
                }}
              >
                <Text
                  style={{
                    color: theme["text-basic-color"],
                    fontWeight: "600",
                  }}
                >
                  {resend}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default VerifyScreen;

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
    paddingBottom: 10,
    paddingHorizontal: 20,
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
    minHeight: 400,
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
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
