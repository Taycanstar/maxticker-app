import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";

type Props = {};

const Terms = ({ navigation }: any) => {
  const theme = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Terms of Service",
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
        By using our app, Maxticker, you agree to be bound by these Terms of
        Service. If you do not agree to these Terms, please do not use our app.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Changes to Terms
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        We reserve the right to modify these Terms at any time. We will always
        post the most current version on our app. By continuing to use
        Maxticker, you agree to be bound by the updated Terms.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Use of Maxticker
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        You agree to use Maxticker only for lawful purposes. You must not use
        our app in any way that is illegal, harmful, or may damage our
        reputation.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Maxticker Plus
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        Users who choose our "Plus" tier will be charged as per the rates
        mentioned in the app. All payments are to be made through Apple Pay or
        credit card. Refunds, if any, will be at our sole discretion.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Data and Privacy
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        By using Maxticker, you agree to the collection and use of your data as
        outlined in our Privacy Policy. All payment-related processes are
        encrypted and securely handled by our payment processors. We do not have
        access to your credit card details or other payment method details.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Termination
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        We reserve the right to terminate or suspend your access to our app
        without prior notice, for conduct that we believe violates these Terms
        or is harmful to other users of [Your App Name], us, or third parties,
        or for any other reason.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Limitation of Liability
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        To the fullest extent permitted by applicable law, Maxticker shall not
        be liable for any indirect, incidental, special, consequential, or
        punitive damages, or any loss of profits or revenues, whether incurred
        directly or indirectly, or any loss of data, use, goodwill, or other
        intangible losses, resulting from (a) your use or inability to use our
        app; (b) any unauthorized access to or use of our servers and/or any
        personal information stored therein.
      </Text>
      <Text style={[styles.title, { color: theme["text-basic-color"] }]}>
        Governing Law
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}>
        These Terms shall be governed by the laws of [Your Country/State],
        without respect to its conflict of laws principles.
      </Text>
      <Text style={[styles.txt, { color: theme["text-basic-color"] }]}> </Text>
    </ScrollView>
  );
};

export default Terms;

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
