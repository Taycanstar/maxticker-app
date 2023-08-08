import { View, Text, TextInput } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  onChange: (text: string) => void;
  value?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  secureTextEntry: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  placeholder?: string;
  isPasswordVisible?: boolean;
  onPress?: () => void;
  placeholderColor: string;
  maxLength: number;
};

const CustomInput: React.FC<Props> = ({
  onChange,
  value,
  textColor,
  bgColor,
  borderColor,
  autoCapitalize,
  keyType,
  placeholder,
  secureTextEntry,
  isPasswordVisible,
  onPress,
  placeholderColor,
  maxLength,
}) => {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        minHeight: 48,
        borderRadius: 5,
        borderWidth: 2,
        paddingVertical: 11,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: bgColor,
        borderColor: borderColor,
        width: "100%",
        flex: 1,
      }}
    >
      <View style={{ flex: 0.9 }}>
        <TextInput
          secureTextEntry={secureTextEntry}
          style={{ marginHorizontal: 8, fontSize: 15, color: textColor }}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          keyboardType={keyType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={placeholderColor}
          maxLength={maxLength}
        />
      </View>

      <View style={{ flex: 0.1 }}>
        {isPasswordVisible ? (
          <Feather
            onPress={onPress}
            size={25}
            name={"eye-off"}
            color={textColor}
          />
        ) : (
          <Feather onPress={onPress} size={25} name={"eye"} color={textColor} />
        )}
      </View>
    </View>
  );
};

export default CustomInput;
