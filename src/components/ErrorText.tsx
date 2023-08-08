import { View, Text } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  text: string;
};

const ErrorText: React.FC<Props> = ({ text }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <View style={{ marginRight: 5 }}>
        <Feather size={18} name={"alert-circle"} color={Colors.error} />
      </View>
      <Text style={{ fontSize: 14, color: Colors.error, fontWeight: "600" }}>
        {text}
      </Text>
    </View>
  );
};

export default ErrorText;
