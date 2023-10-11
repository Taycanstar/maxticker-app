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

type Props = {
  label: string;
  iconName?: any;
  focused?: boolean;
  onPress?: () => void;
  nav?: any;
};

const rows: Props[] = [
  // { label: "Learn more", iconName: "info", nav: "About" },
  { label: "Terms of Service", iconName: "file-text", nav: "Terms" },
  { label: "Privacy Policy", iconName: "shield", nav: "PrivacyPolicy" },
];

const AboutScreen: React.FC = () => {
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
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
