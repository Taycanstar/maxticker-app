import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";

type Props = {
  text?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  onPress?: () => void;
  fontSize?: number;
  fontWeight?: any;
};

const CustomButton: React.FC<Props> = ({
  textColor,
  bgColor,
  borderColor,
  text,
  onPress,
  fontSize,
  fontWeight,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        minHeight: 48,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: bgColor,
        borderColor: borderColor,
        width: "100%",
        marginBottom: 10,
        paddingVertical: 11,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          fontSize: fontSize,
          color: textColor,
          textAlign: "center",
          fontWeight: fontWeight,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
