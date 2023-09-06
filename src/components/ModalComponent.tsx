import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import Feather from "@expo/vector-icons/Feather";

type Item = {
  icon?: any; // or a more specific type if you know what it is
  name: string;
  isPlus: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  height: number;
  items: Item[];
  title?: string;
  icon?: any;
  handlePress?: () => void;
};

const ModalComponent: React.FC<Props> = ({
  visible,
  onClose,
  height,
  title,
  items,
  icon,
  handlePress,
}) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View
              style={{
                justifyContent: "space-between",
                backgroundColor: theme["card-bg"],
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View
                style={[
                  styles.modalView3,
                  {
                    backgroundColor: theme["card-bg"],
                    paddingHorizontal: 15,
                    height: Dimensions.get("window").height * height,
                  },
                ]}
              >
                {items?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={handlePress}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        paddingVertical: 15,
                        backgroundColor: theme["btn-bg"],
                        marginBottom: 15,
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        {item.icon && (
                          <Feather
                            color={theme["text-basic-color"]}
                            size={18}
                            name={item.icon}
                          />
                        )}

                        <Text
                          style={{
                            color: theme["text-basic-color"],
                            fontSize: 16,
                            fontWeight: "400",
                            // paddingHorizontal: 15,
                            marginLeft: 15,
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>

                      {item.isPlus && (
                        <View
                          style={{
                            backgroundColor: theme["ios-blue"],
                            paddingHorizontal: 10,
                            paddingVertical: 2,
                            borderRadius: 5,
                            marginHorizontal: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: theme["text-basic-color"],
                              fontWeight: "bold",
                            }}
                          >
                            PLUS
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end", // Aligns the modal to the bottom
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalView3: {
    width: "100%", // Full width
    // 65% height
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 25,
    paddingVertical: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
