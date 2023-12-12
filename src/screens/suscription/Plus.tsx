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
  const { subscription, setSubscription, fetchSubscription, isLoading } =
    useSubscription();
  const userData = useSelector((state: any) => state.user);
  const userId = userData?.data?.user?._id;
  const [data, setData] = useState(null);
  const [isCancelVisible, setIsCancelVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [item, setItem] = useState("");

  const effectiveSubscription =
    isLoading || subscription === null
      ? userData?.data?.user?.subscription
      : subscription;

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

  const handleMonthly = async (userId: any) => {
    try {
      // Step 1: Log in the user with their unique identifier
      const loginResult = await Purchases.logIn(userId);
      const customerInfoAtLogin = loginResult.customerInfo;
      const created = loginResult.created;

      // Check if the user was just created in this logIn call
      if (created) {
        console.log("New user created in RevenueCat");
      }

      // Step 2: Fetch offerings
      const offerings = await Purchases.getOfferings();

      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length > 0
      ) {
        // Step 3: Find the correct package and make the purchase
        const monthlyPackage = offerings.current.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_monthly"
        );

        if (monthlyPackage) {
          console.log("Monthly Package found:", monthlyPackage);

          // Make the purchase
          const purchaseResult = await Purchases.purchasePackage(
            monthlyPackage
          );
          const customerInfoAfterPurchase = purchaseResult.customerInfo;

          // Check for active entitlements
          if (customerInfoAfterPurchase.entitlements.active["Plus"]) {
            console.log("Purchase successful, entitlement is active");

            // Unlock the premium content
          } else {
            console.log(
              "Purchase successful, but the entitlement is not active"
            );

            // The purchase was successful but the entitlement is not active, handle this case
          }
          fetchSubscription();
        } else {
          console.log("Monthly package not found");
        }
      } else {
        console.log("No packages are available");
      }
    } catch (e) {
      console.error("An error occurred:", e);
    }
  };

  const handleAnnually = async (userId: any) => {
    try {
      // Step 1: Log in the user with their unique identifier
      const loginResult = await Purchases.logIn(userId);
      const customerInfoAtLogin = loginResult.customerInfo;
      const created = loginResult.created;

      // Check if the user was just created in this logIn call
      if (created) {
        console.log("New user created in RevenueCat");
      }

      // Step 2: Fetch offerings
      const offerings = await Purchases.getOfferings();

      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length > 0
      ) {
        // Step 3: Find the correct package and make the purchase
        const annualPackage = offerings.current.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_annual"
        );

        if (annualPackage) {
          console.log("Monthly Package found:", annualPackage);

          // Make the purchase
          const purchaseResult = await Purchases.purchasePackage(annualPackage);
          const customerInfoAfterPurchase = purchaseResult.customerInfo;

          // Check for active entitlements
          if (customerInfoAfterPurchase.entitlements.active["Plus"]) {
            console.log("Purchase successful, entitlement is active");

            // Unlock the premium content
          } else {
            console.log(
              "Purchase successful, but the entitlement is not active"
            );

            // The purchase was successful but the entitlement is not active, handle this case
          }
          fetchSubscription();
        } else {
          console.log("Monthly package not found");
        }
      } else {
        console.log("No packages are available");
      }
    } catch (e) {
      console.error("An error occurred:", e);
    }
  };

  const handleSub = () => {
    if (!isEnabled) {
      handleAnnually(userId);
    } else {
      handleMonthly(userId);
    }
    fetchSubscription();
  };

  console.log(effectiveSubscription, "datta");

  console.log(isLoading, "loading");

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
              {effectiveSubscription === "standard"
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
          {effectiveSubscription === "standard" && (
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
        {effectiveSubscription === "plus" && (
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
        {/* <TouchableOpacity onPress={fetchSubscription}>
          <Text style={{ color: "#fff" }}> PRESS ME</Text>
        </TouchableOpacity> */}
        {effectiveSubscription === "standard" ? (
          <TouchableOpacity
            onPress={handleSub}
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
        ) : // <TouchableOpacity
        //   onPress={() => setIsCancelVisible(true)}
        //   style={{
        //     backgroundColor: theme["card-bg"],
        //     flexDirection: "row",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     padding: 15,
        //     borderRadius: 50,
        //   }}
        // >
        //   <Text
        //     style={{
        //       color: theme["ios-red"],
        //       fontWeight: "600",
        //     }}
        //   >
        //     Cancel subscription
        //   </Text>
        // </TouchableOpacity>
        null}
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
