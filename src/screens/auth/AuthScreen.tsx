import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { Card, Text, Button, Layout } from "@ui-kitten/components";
import { blackLogo, whiteLogo } from "../../images/ImageAssets";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../navigation/AppNavigator";
import { useTheme } from "@ui-kitten/components";
import { ThemeContext } from "../../utils/themeContext";

type Props = {};

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const AuthScreen: React.FC = () => {
  const themeContext = useContext<ThemeContextType>(ThemeContext);

  const { navigate } = useNavigation<StackNavigation>();
  const theme = useTheme();
  const onEmailSignupPress = () => {
    try {
    } catch (error) {}
    navigate("Signup");
  };
  const onLoginPress = () => {
    navigate("Login");
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.primary }]}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={whiteLogo} />
      </View>
      <Layout
        style={[
          styles.card,
          { backgroundColor: theme["background-basic-color-1"] },
        ]}
      >
        <View style={styles.btnContainer}>
          <Button
            status="info"
            size="large"
            style={{
              borderRadius: 15,
            }}
            onPress={onEmailSignupPress}
          >
            {(evaProps) => (
              <Text
                {...evaProps}
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 17,
                  letterSpacing: 0.25,
                }}
              >
                Signup with email
              </Text>
            )}
          </Button>
        </View>
        <View style={styles.btnContainer}>
          <Button
            size="large"
            status={themeContext.theme === "light" ? "warning" : "success"}
            style={{
              borderRadius: 15,
              borderWidth: 2,
              borderColor: Colors.metagray,
            }}
            onPress={onLoginPress}
          >
            {(evaProps) => (
              <Text
                {...evaProps}
                style={{
                  color: "black",
                  fontWeight: "600",
                  fontSize: 17,
                  letterSpacing: 0.25,
                }}
              >
                Login
              </Text>
            )}
          </Button>
        </View>
      </Layout>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  card: {
    // backgroundColor: "black",
    flex: 0.3,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  btn: {
    borderWidth: 2,
    borderRadius: 15,
  },
  signupBtnTxt: {},
  btnContainer: {
    marginBottom: 10,
  },
});
