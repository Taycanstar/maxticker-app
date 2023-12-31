import { View, Text, TextInput } from "react-native";
import React from "react";

type Props = {
  onChange: (text: string) => void;
  value?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "phone-pad";
  placeholder?: string;
  placeholderColor?: string;
  inputMode?: any;
  onBlur?: () => void;
  onFocus?: () => void;
  autoFocus?: boolean;
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
  inputMode,
  placeholderColor,
  onBlur,
  onFocus,
  autoFocus,
}) => {
  return (
    <View
      style={{
        minHeight: 48,
        borderRadius: 10,
        borderWidth: 1,

        flexDirection: "row",
        alignItems: "center",
        backgroundColor: bgColor,
        borderColor: borderColor,
        width: "100%",
        marginBottom: 10,
      }}
    >
      <TextInput
        style={{
          paddingVertical: 11,
          paddingHorizontal: 16,
          fontSize: 15,
          color: textColor,
          width: "100%",
        }}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        keyboardType={keyType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={placeholderColor}
        inputMode={inputMode}
        onBlur={onBlur}
        onFocus={onFocus}
        autoFocus={autoFocus}
      />
    </View>
  );
};

export default CustomInput;
