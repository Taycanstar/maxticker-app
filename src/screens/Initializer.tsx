// Initializer.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { remoteStart } from "../../src/store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { AppDispatch } from "../store";

const Initializer = ({ setDeviceId }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchDeviceId = async () => {
      let storedDeviceId = await AsyncStorage.getItem("deviceId");
      if (!storedDeviceId) {
        storedDeviceId = await DeviceInfo.getUniqueId();
        await AsyncStorage.setItem("deviceId", storedDeviceId);
      }
      if (storedDeviceId) {
        setDeviceId(storedDeviceId);
        dispatch(remoteStart(storedDeviceId)); // Use storedDeviceId directly
      }
    };

    fetchDeviceId();
  }, [setDeviceId, dispatch]);

  return null;
};

export default Initializer;
