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
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigation } from "../../navigation/AppNavigator";
import { Layout, useTheme } from "@ui-kitten/components";
import { blackLogo } from "../../images/ImageAssets";
import { createCheckoutSession } from "../../store/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";

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

  const handleSubmit = async () => {
    setLoading(true);
    await dispatch(createCheckoutSession);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
              Unlock Maxticker Plus for premium tools, limitless customization,
              and expanded possibilities.
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
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
      </View>
      <View
        style={{ backgroundColor: theme["btn-bg"], padding: 25, flex: 0.2 }}
      >
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
      </View>
    </Layout>
  );
};

export default Plus;
