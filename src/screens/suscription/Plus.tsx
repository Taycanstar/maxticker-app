import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Switch,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../navigation/AppNavigator";
import { Layout, useTheme } from "@ui-kitten/components";
import { blackLogo } from "../../images/ImageAssets";
import { createCheckoutSession } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { useSubscription } from "../../contexts/SubscriptionContext";
import {
  StripeProvider,
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
  useStripe,
} from "@stripe/stripe-react-native";
import api from "../../api";
// import * as Linking from "expo-linking";

type Props = {};

type PlusProps = {
  navigation: StackNavigation;
};

const Plus: React.FC<PlusProps> = ({ navigation }) => {
  const theme = useTheme();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [price, setPrice] = useState<string>("$49.99 / year");
  const [oldPrice, setOldPrice] = useState<string>("$59.99");
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const { subscription, setSubscription } = useSubscription();
  const [ready, setReady] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { isPlatformPaySupported, confirmPlatformPayPayment } =
    usePlatformPay();
  const userData = useSelector((state: any) => state.user);
  const userId = userData?.data?.user?._id;
  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");
  const { confirmPayment } = useStripe();

  // useEffect(() => {
  //   setup();
  // }, []);

  // const setup = async () => {
  //   if (!(await isPlatformPaySupported())) {
  //     Alert.alert(
  //       "Error",
  //       `${Platform.OS === "android" ? "Google" : "Apple"} Pay is not supported`
  //     );
  //     return;
  //   }

  //   const response = await fetch(`${api}/pay/create-payment-intent`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       currency: "usd",
  //     }),
  //   });

  //   const result = await response.json();
  //   setClientSecret(result.clientSecret());
  //   setReady(true);
  // };
  async function createCheckoutSession() {
    try {
      const response = await fetch(
        `http://localhost:8000/pay/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include any other headers your API requires
          },
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      // const { sessionId } = await response.json();
      // return sessionId;
      const { checkoutUrl } = await response.json(); // Extract checkoutUrl from response
      return checkoutUrl;
    } catch (error) {
      console.error("Failed to fetch session:", error);
      throw error;
    }
  }
  const handleSubmit = async () => {
    try {
      // Step 1: Fetch the session ID from your backend
      // const sessionId = await createCheckoutSession();
      const checkoutUrl = await createCheckoutSession();

      // Step 2: Redirect the user to Stripe's checkout page
      // const stripeUrl = `https://checkout.stripe.com/pay/${sessionId}`;
      Linking.openURL(checkoutUrl);
    } catch (error: any) {
      console.error("Error creating checkout session:", error.message);
      // Optionally show an error message to the user...
    }
  };

  const handleOpenURL = (event: any) => {
    if (event.url.startsWith("my-app://success")) {
      // Handle successful payment
      console.log("Payment was successful");
    } else if (event.url.startsWith("my-app://cancel")) {
      // Handle cancelled payment
      console.log("Payment was cancelled");
    }
  };

  useEffect(() => {
    // Add event listener for url event
    const subscription = Linking.addEventListener("url", handleOpenURL);

    // Clean up event listener
    return () => {
      subscription.remove();
    };
  }, []);

  const handleCancel = () => {};

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/get-user-by-id/${userId}`);
        if (mounted) {
          setData(data);
          setEmail(data.email);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: theme["background-basic-color-1"],
        justifyContent: "space-between",
      }}
    >
      <View style={{ paddingHorizontal: 20, marginVertical: 15, flex: 0.8 }}>
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            backgroundColor: theme["btn-bg"],
            borderRadius: 10,
          }}
        >
          <View style={{ width: "70%" }}>
            <Text
              style={{
                color: theme["text-basic-color"],
                fontSize: 17,
                fontWeight: "700",
              }}
            >
              {subscription === "standard"
                ? "You have now access to premium tools, limitless customization and expanded possibilities."
                : "Unlock Maxticker Plus for premium tools, limitless customization,and expanded possibilities."}
            </Text>
          </View>

          <View
            style={{
              width: "30%",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Image
              source={blackLogo}
              style={{ width: 90, height: 90 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={{ marginVertical: 20 }}>
          {subscription === "standard" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: theme["text-basic-color"],
                    fontSize: 17,
                    fontWeight: "500",
                    marginBottom: 10,
                  }}
                >
                  {isEnabled ? "Monthly" : "Annually"}
                </Text>
                {!isEnabled && (
                  <View
                    style={{
                      backgroundColor: "rgba(9, 121, 105, 0.5)",
                      alignItems: "center",
                      justifyContent: "center",
                      // width: 70,
                      borderRadius: 50,
                      height: 25,
                      marginHorizontal: 10,
                      paddingHorizontal: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "rgb(175, 225, 175)",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      SAVE 16%
                    </Text>
                  </View>
                )}
              </View>
              <Switch
                trackColor={{
                  false: theme["ios-green"],
                  true: theme["ios-blue"],
                }}
                thumbColor="#fff"
                ios_backgroundColor={theme["ios-green"]}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          )}

          <View
            style={{
              borderRadius: 8,
              borderColor: theme["ios-blue"],
              borderWidth: 1,
              marginVertical: 15,

              padding: 10,
              backgroundColor: theme["card-bg"],
            }}
          >
            <Text
              style={{
                color: theme["text-basic-color"],
                fontSize: 20,
                fontWeight: "700",
                paddingHorizontal: 10,
              }}
            >
              Plus
            </Text>
            <View
              style={{
                marginTop: 10,
                backgroundColor: theme["btn-bg"],
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: theme["text-basic-color"],
                  // fontSize: 20,
                  // fontWeight: "700",
                }}
              >
                Experience no boundaries. Create, manage, and complete as many
                tasks as you need
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: theme["btn-bg"],
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: theme["text-basic-color"],
                  // fontSize: 20,
                  // fontWeight: "700",
                }}
              >
                Access more in-depth parameters for a comprehensive view of your
                performance and insights
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: theme["btn-bg"],
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: theme["text-basic-color"],
                  // fontSize: 20,
                  // fontWeight: "700",
                }}
              >
                Express yourself and categorize tasks with ease. Choose from a
                vibrant palette to add colors, making your task list visually
                appealing
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: theme["btn-bg"],
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: theme["text-basic-color"],
                  // fontSize: 20,
                  // fontWeight: "700",
                }}
              >
                Upgrade to Plus Subscription for an unmatched control, clarity,
                and customization experience
              </Text>
            </View>
          </View>
        </View>
        {subscription === "plus" && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: theme["text-basic-color"],
                  fontSize: 17,
                  fontWeight: "800",
                  marginBottom: 10,
                }}
              >
                Subscription
              </Text>
            </View>
            <View
              style={{
                borderRadius: 100,
                flexDirection: "row",
                paddingHorizontal: 15,
                paddingVertical: 5,
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme["card-bg"],
              }}
            >
              <Ionicons
                color={theme["ios-blue"]}
                size={18}
                name="checkmark-circle"
              />
              <Text
                style={{
                  color: theme["text-basic-color"],
                  marginLeft: 5,
                  fontWeight: "600",
                }}
              >
                Active
              </Text>
            </View>
          </View>
        )}
      </View>
      <View
        style={{ backgroundColor: theme["btn-bg"], padding: 25, flex: 0.2 }}
      >
        {subscription === "standard" ? (
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: theme["text-basic-color"],
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              borderRadius: 50,
            }}
          >
            {!isEnabled && (
              <Text
                style={{
                  textDecorationLine: "line-through",
                  color: theme["background-basic-color-1"],
                }}
              >
                {oldPrice}{" "}
              </Text>
            )}

            <Text
              style={{
                color: theme["background-basic-color-1"],
                fontWeight: "bold",
              }}
            >
              {!isEnabled ? "$49.99 / year" : "$4.99 / month"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              backgroundColor: theme["card-bg"],
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              borderRadius: 50,
            }}
          >
            <Text
              style={{
                color: theme["ios-red"],
                fontWeight: "600",
              }}
            >
              Cancel subscription
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Layout>
  );
};

export default Plus;
