import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";

type Props = {};

const PrivacyPolicy = ({ navigation }: any) => {
  const theme = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Privacy Policy",
      headerTintColor: theme["text-basic-color"],

      headerStyle: {
        backgroundColor: theme["background-basic-color-1"],
        elevation: 0, // This removes the shadow for Android
        borderBottomWidth: 0,
        shadowOpacity: 0,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 10 }}
        >
          <Feather
            name="arrow-left"
            size={25}
            color={theme["text-basic-color"]}
          />
        </TouchableOpacity>
      ),

      headerRight: () => null,
    });
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        Thank you for choosing Maxticker. We are committed to protecting your
        personal information and your right to privacy. This Privacy Policy
        outlines our practices concerning the information we collect from you
        when you use our app
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Information We Collect
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        Personal Data: We collect personal data that you provide to us,
        including your name and email address. Usage Data: We collect data
        related to your use of our app, such as tasks, time spent on tasks, and
        analytics. Payment Data: For users who choose our "Plus" tier, we
        collect payment information through Apple Pay or credit card. However,
        we do not store or process this data; it is handled by our payment
        processors.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        How We Use Your Information
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        To Provide Our Service: We use your personal data to manage your
        account, provide you with customer support, and ensure you can use our
        app effectively. For Analytics: We use the usage data to understand how
        our users use our app and to improve our service. For Communication: We
        may use your personal data to contact you about updates, security
        alerts, and support.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Security of Your Data
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        We prioritize the security of your data. Your password is hashed,
        ensuring it is secure. We also use secure methods to store your personal
        data, like MongoDB, which has its own security protocols.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Payment Information
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        All payment-related processes are encrypted and securely handled by our
        payment processors. We do not have access to your credit card details or
        other payment method details.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Your Rights
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        You have the right to access, update, or delete your personal data. If
        you wish to be informed about the personal data we hold about you and if
        you want it to be removed from our systems, please contact us.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Changes to This Privacy Policy
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page and
        updating the "Last updated" date.
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}> </Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  title: {
    fontWeight: "700",
    marginVertical: 10,
  },
  txt: {
    fontWeight: "400",
    marginVertical: 10,
  },
});
