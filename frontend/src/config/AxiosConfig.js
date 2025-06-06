import axios from "axios";
import { useEffect, useState } from "react";
import { REACT_APP_API_BASE_URL } from "./ApiConfig";
import { getToken } from "../utils/Helper";
import { getItem } from "../utils/Helper";

const useAxiosInstances = () => {

  const [axiosInstances, setAxiosInstances] = useState({
    axios: axios.create({
      baseURL: REACT_APP_API_BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
        "Authorization": "Bearer " + getItem('access_token'),
        "device_type": "web",
      },
    }),
    axiosFormData: axios.create({
      baseURL: REACT_APP_API_BASE_URL,
      headers: {
        Accept: "application/json",
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "",
        "Access-Control-Allow-Headers": "",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
         "Authorization": "Bearer " + getItem('access_token'),
        "device_type": "web",
      },
    }),
  });

  useEffect(() => {

    const AxiosInstance = axios.create({
      baseURL: REACT_APP_API_BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
        "Authorization": "Bearer " + getItem('access_token'),
        "device_type": "web",
      },
    });

    const AxiosFormDataInstance = axios.create({
      baseURL: REACT_APP_API_BASE_URL,
      headers: {
        Accept: "application/json",
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Origin": "",
        "Access-Control-Allow-Headers": "",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
         "Authorization": "Bearer " + getItem('access_token'),
        "device_type": "web",
      },
    });

    setAxiosInstances({
      axios: AxiosInstance,
      axiosFormData: AxiosFormDataInstance,
    });
  }, []); // Empty dependency array ensures this runs only on mount

  return axiosInstances;
};

export default useAxiosInstances;
