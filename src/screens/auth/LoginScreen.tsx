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

type Props = {};

const LoginScreen: React.FC = () => {
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { navigate } = useNavigation<StackNavigation>();
  const navigation = useNavigation<StackNavigation>();
  const theme = useTheme();

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onContinuePress = () => {};
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
          <View style={styles.inputContainer}>
            <Input
              status="warning"
              style={{
                backgroundColor: theme["input-background-color-1"],
                borderColor: theme["input-border-color-1"],
              }}
              size="large"
              value={email}
              placeholder="Email"
              onChangeText={(nextValue) => setEmail(nextValue)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Input
              status="warning"
              style={{
                backgroundColor: theme["input-background-color-1"],
                borderColor: theme["input-border-color-1"],
              }}
              size="large"
              value={password}
              placeholder="Password"
              accessoryRight={() => {
                return (
                  <Feather
                    color="white"
                    size={18}
                    onPress={toggleSecureEntry}
                    name={secureTextEntry ? "eye-off" : "eye"}
                  />
                );
              }}
              secureTextEntry={secureTextEntry}
              onChangeText={(nextValue) => setPassword(nextValue)}
            />
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
