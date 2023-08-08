import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
  DetailsScreenRouteProp,
  type StackNavigation,
} from "../../navigation/AppNavigator";
import PhoneInput from "react-native-phone-input";
import CustomInput from "../../components/CustomInput";
import { sendCode } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";

type Props = {};
type DetailsScreenProps = {
  route: DetailsScreenRouteProp;
};

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  if (!route.params) {
    return null; // or any other fallback JSX/render
  }

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { navigate } = useNavigation<StackNavigation>();
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();
  const phoneRef = useRef<PhoneInput>(null);
  const { email, password } = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const onContinuePressx = () => {
    navigate("Verify", {
      email,
      password,
      phoneNumber,
      birthday,
      firstName,
      lastName,
    });
  };
  const onBackPress = () => {
    navigation.goBack();
  };

  const handleBdChange = (value: string) => {
    const input = value.replace(/\D/g, ""); // Remove non-digit characters
    let formattedDate = "";

    if (input.length > 0) {
      formattedDate += input.substr(0, 2);
    }
    if (input.length > 2) {
      formattedDate += "/" + input.substr(2, 2);
    }
    if (input.length > 4) {
      formattedDate += "/" + input.substr(4, 4);
    }

    setBirthday(formattedDate);
  };
  const onContinuePress = async () => {
    try {
      // Dispatch the confirmUser action with the necessary payload
      setLoading(true);
      const res = await dispatch(sendCode(phoneNumber));
      console.log(res, "response");
      setTimeout(() => {
        setLoading(false);
      }, 500);
      navigate("Verify", {
        email,
        password,
        phoneNumber,
        birthday,
        firstName,
        lastName,
      });
    } catch (error) {
      console.log(error);
    }
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
              Tell us more about you
            </Text>
          </View>
          <View style={styles.names}>
            <View
              style={[
                styles.inputCnt,
                {
                  backgroundColor: theme["input-background-color-1"],
                  borderColor: theme["input-border-color-1"],
                },
              ]}
            >
              <TextInput
                placeholder="First name"
                placeholderTextColor={theme["input-placeholder-color"]}
                value={firstName}
                autoCapitalize="words"
                onChangeText={(newText) => setFirstName(newText)}
                style={[
                  styles.input1,
                  {
                    width: "100%",
                    fontSize: 15,
                    marginHorizontal: 8,
                    color: theme["text-basic-color"],
                  },
                ]}
              />
            </View>
            <View
              style={[
                styles.inputCnt2,
                {
                  backgroundColor: theme["input-background-color-1"],
                  borderColor: theme["input-border-color-1"],
                },
              ]}
            >
              <TextInput
                placeholder="Last name"
                placeholderTextColor={theme["input-placeholder-color"]}
                value={lastName}
                autoCapitalize="words"
                onChangeText={(newText) => setLastName(newText)}
                style={[
                  styles.input2,
                  {
                    fontSize: 15,
                    marginHorizontal: 8,
                    width: "100%",
                    color: theme["text-basic-color"],
                    borderColor: theme["input-border-color-1"],
                  },
                ]}
              />
            </View>
          </View>
          <CustomInput
            placeholder="Birthday"
            textColor={theme["text-basic-color"]}
            bgColor={theme["input-background-color-1"]}
            borderColor={theme["input-border-color-1"]}
            onChange={handleBdChange}
            autoCapitalize="none"
            value={birthday}
            inputMode="numeric"
            placeholderColor={theme["input-placeholder-color"]}
          />

          <View style={styles.phContainer}>
            <PhoneInput
              initialCountry={"us"}
              style={{
                backgroundColor: theme["input-background-color-1"],
                borderColor: theme["input-border-color-1"],
                height: 48,
                paddingVertical: 11,
                paddingHorizontal: 11,
                borderRadius: 4,
                marginBottom: 10,
              }}
              ref={phoneRef}
              textProps={{
                placeholder: "Phone number",
                placeholderTextColor: theme["input-placeholder-color"],
              }}
              textStyle={{ color: theme["text-basic-color"] }}
              onChangePhoneNumber={(newText) => setPhoneNumber(newText)}
            />
          </View>
          <View style={{ marginBottom: 15 }}>
            <Text
              style={{
                color: theme["text-secondary-color"],
                fontSize: 13,
              }}
            >
              Your phone number will only be used to verify your identity for
              security purposes
            </Text>
          </View>

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

export default DetailsScreen;

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
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  names: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input1: {
    // flex: 1,
    // marginRight: 5,
    // Adjust as needed
  },
  input2: {
    // flex: 1,
    // marginLeft: 10,
    // Adjust as needed
  },
  phContainer: {
    // flex: 1,
    width: "100%",
  },
  inputCnt: {
    paddingHorizontal: 8,
    minHeight: 48,
    borderRadius: 5,
    borderWidth: 2,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    flex: 0.5,
    marginBottom: 10,
  },
  inputCnt2: {
    paddingHorizontal: 8,
    minHeight: 48,
    borderRadius: 5,
    borderWidth: 2,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    flex: 0.5,
    marginBottom: 10,
    marginLeft: 10,
  },
});
