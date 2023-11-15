import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton";
import { Layout, useTheme } from "@ui-kitten/components";
import Colors from "../../constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import {
  HomeScreenRouteProp,
  type StackNavigation,
} from "../../navigation/AppNavigator";
import { logoutUser } from "../../store/user";
import { AppDispatch } from "../../store";
import { useSelector, useDispatch } from "react-redux";

type Props = {
  label: string;
  iconName?: any;
  focused?: boolean;
  onPress?: () => void;
  nav?: any;
};

const rows: Props[] = [
  { label: "Profile", iconName: "settings", nav: "Profile" },
  { label: "Subscription", iconName: "check", nav: "Subscription" },
  // { label: "Personal information", iconName: "user", nav: "PersonalInfo" },
  // { label: "Password and Security", iconName: "shield", nav: "Password" },
];

const AccountScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { navigate } = useNavigation<StackNavigation>();
  const onPress = (screen: any) => {
    navigate(screen.nav);
  };
  return (
    <SafeAreaView
      style={{ backgroundColor: theme["background-basic-color-1"], flex: 1 }}
    >
      {rows.map((row, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={styles.itemContainer}
            onPress={() => onPress(row)}
          >
            <View style={{ flexDirection: "row" }}>
              {row.iconName && (
                <Feather
                  name={row.iconName}
                  size={20}
                  color={Colors.lightergray}
                />
              )}
              <Text
                style={{
                  color: theme["text-basic-color"],
                  marginLeft: 15,
                  fontSize: 16,
                }}
              >
                {row.label}
              </Text>
            </View>

            <Feather
              name="arrow-right"
              size={25}
              color={theme["text-basic-color"]}
            />
          </TouchableOpacity>
        );
      })}

      {/* <TouchableOpacity
        style={styles.itemContainer}
        onPress={async () => {
          const action = dispatch(logoutUser);
          try {
            const resultAction = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(resultAction)) {
              console.log("Logout successful");
              // Additional logic for successful logout, if needed
            }
          } catch (error) {
            console.error("Logout failed", error);
            // Additional logic for failed logout, if needed
          }
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Feather name="log-out" size={20} color={Colors.lightergray} />

          <Text
            style={{
              color: theme["text-basic-color"],
              marginLeft: 15,
              fontSize: 16,
            }}
          >
            Log out
          </Text>
        </View>

        <Feather
          name="arrow-right"
          size={25}
          color={theme["text-basic-color"]}
        />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
