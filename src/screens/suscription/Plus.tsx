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
  Alert,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../navigation/AppNavigator";
import { Layout, useTheme } from "@ui-kitten/components";
import { blackLogo } from "../../images/ImageAssets";
import { createCheckoutSession, cancelSubscription } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { useSubscription } from "../../contexts/SubscriptionContext";
import * as WebBrowser from "expo-web-browser";
import Purchases from "react-native-purchases";

import {
  StripeProvider,
  usePlatformPay,
  PlatformPayButton,
  PlatformPay,
  useStripe,
} from "@stripe/stripe-react-native";
import api from "../../api";
import * as Linking from "expo-linking";

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
  const { subscription, setSubscription, fetchSubscription } =
    useSubscription();
  const userData = useSelector((state: any) => state.user);
  const userId = userData?.data?.user?._id;
  const [data, setData] = useState(null);
  const [isCancelVisible, setIsCancelVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const { confirmPayment } = useStripe();
  const [item, setItem] = useState("");

  async function createCheckoutSession() {
    try {
      const response = await fetch(
        // `http://localhost:8000/pay/create-checkout-session`,
        `https://maxticker-55df64f66a64.herokuapp.com/pay/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include any other headers your API requires
          },
          body: JSON.stringify({
            userId: userId,
            item: isEnabled ? "monthly" : "annually",
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
      const result = await WebBrowser.openBrowserAsync(checkoutUrl);
      if (result.type === "cancel") {
        console.log("Payment was cancelled");
      } else if (result.type === "dismiss") {
        console.log("Browser was closed");
      }
      fetchSubscription();
      // Linking.openURL(checkoutUrl);
    } catch (error: any) {
      console.error("Error creating checkout session:", error.message);
      // Optionally show an error message to the user...
    }
  };

  const handleOpenURL = (event: any) => {
    if (event.url.startsWith(Linking.createURL("/success"))) {
      // Handle successful payment
      console.log("Payment was successful");
    } else if (event.url.startsWith(Linking.createURL("/cancel"))) {
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

  const handleCancelPress = async () => {
    let action = await dispatch(cancelSubscription(userId));
    if ("error" in action) {
      setIsError(true);
      const errorMessage = (action.payload as { message: string }).message;
      setErrorText(errorMessage);
      setTimeout(() => setIsError(false), 4000);
      console.log(`Error on Screen`, errorMessage);
      setIsCancelVisible(false);
      return true;
    } else {
      console.log("success subscription cancelled ");
      setSubscription("standard");
      setIsCancelVisible(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  // const handleMonthly = async () => {
  //   try {
  //     const offerings = await Purchases.getOfferings();
  //     if (
  //       offerings.current !== null &&
  //       offerings.current.availablePackages.length > 0
  //     ) {
  //       // Log all available packages
  //       // console.log("Available Packages:", offerings.current.availablePackages);

  //       const monthlyPackage = offerings.current.availablePackages.find(
  //         (pkg) => pkg.identifier === "$rc_monthly"
  //       );
  //       if (monthlyPackage) {
  //         // You can now use monthlyPackage to display package information and make purchases
  //         console.log("Monthly Package found:", monthlyPackage);
  //       } else {
  //         console.log("Monthly package not found");
  //       }
  //     } else {
  //       console.log("No packages are available");
  //     }
  //   } catch (e) {
  //     console.error("Error fetching offerings:", e);
  //   }
  // };
  const handleMonthly = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length > 0
      ) {
        const monthlyPackage = offerings.current.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_monthly"
        );
        if (monthlyPackage) {
          // Monthly Package found, proceed with purchase
          console.log("Monthly Package found:", monthlyPackage);
          try {
            const { customerInfo } = await Purchases.purchasePackage(
              monthlyPackage
            );
            // Assuming you have an entitlement identifier like 'premium_access'
            if (customerInfo.entitlements.active["Plus"]) {
              console.log("Purchase successful, entitlement is active");
              // Unlock the premium content
            } else {
              console.log(
                "Purchase successful, but the entitlement is not active"
              );
              // The purchase was successful but the entitlement is not active, handle this case
            }
          } catch (e: any) {
            if (!e.userCancelled) {
              // Handle the error, user did not cancel but the purchase failed
              console.error("Purchase failed with error:", e);
            } else {
              // User cancelled the purchase
              console.log("User cancelled the purchase");
            }
          }
        } else {
          console.log("Monthly package not found");
        }
      } else {
        console.log("No packages are available");
      }
    } catch (e) {
      console.error("Error fetching offerings:", e);
    }
  };

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
                : "Unlock Maxticker Plus for premium tools, limitless customization and expanded possibilities."}
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
        {/* <TouchableOpacity onPress={fetchSubscription}> */}
        {/* <Text style={{ color: "#fff" }}> PRESS ME</Text> */}
        {/* </TouchableOpacity> */}
        {subscription === "standard" ? (
          <TouchableOpacity
            onPress={handleMonthly}
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
            onPress={() => setIsCancelVisible(true)}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCancelVisible}
        onRequestClose={() => {
          setIsCancelVisible(!isCancelVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setIsCancelVisible(false)}>
          <View style={styles.deleteOverlay}>
            <View style={styles.centeredViewDel}>
              <View
                style={[
                  styles.modalViewDel,
                  { backgroundColor: theme["btn-bg"] },
                ]}
              >
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: theme["text-basic-color"],
                      textAlign: "center",
                      marginVertical: 15,
                    },
                  ]}
                >
                  Confirm Cancellation
                </Text>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: theme["text-basic-color"],
                      fontWeight: "400",
                      paddingHorizontal: 30,
                      fontSize: 14,
                      marginBottom: 15,
                    },
                  ]}
                >
                  If you confirm and end your subscription now, you can still
                  access it until the remaining of the billing period
                </Text>

                <TouchableOpacity
                  onPress={handleCancelPress}
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme["btn-bg"],
                      borderColor: theme["border-gray"],
                    },
                  ]}
                >
                  <Text
                    style={[styles.textStyle, { color: theme["meta-red"] }]}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme["btn-bg"],
                      borderColor: theme["border-gray"],
                      paddingBottom: 0,
                    },
                  ]}
                  onPress={() => setIsCancelVisible(false)}
                >
                  <Text
                    style={[
                      styles.textStyle,
                      { color: theme["text-basic-color"], fontWeight: "400" },
                    ]}
                  >
                    Not now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Layout>
  );
};

export default Plus;

const styles = StyleSheet.create({
  centeredViewDel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  modalViewDel: {
    width: "80%",

    backgroundColor: "transparent",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 15,
  },
  button: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    flexDirection: "row",
    paddingVertical: 15,
    borderTopWidth: 0.5,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  textStyle2: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  deleteOverlay: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)", // semi-transparent background
  },
});
