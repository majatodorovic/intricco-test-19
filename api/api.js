import axios from "axios";
import Cookies from "js-cookie";

const generateDeviceToken = () => {
  return "device_" + Math.random().toString(12) + Date.now();
};

const getDeviceToken = () => {
  let device_token = Cookies.get("device_token");
  if (!device_token) {
    device_token = generateDeviceToken();
    Cookies.set("device_token", device_token, { expires: 365 });
  }
  return device_token;
};

const getCustomerToken = () => {
  let customer_token = Cookies.get("customer_token");
  if (!customer_token) {
    customer_token = getDeviceToken();
    Cookies.set("customer_token", customer_token, { expires: 365 });
  }

  return customer_token;
};

const makeRequest = async (method, path, payload, token) => {
  let device_token, customer_token, refererUrl;

  /**
   * Checking whether the request is sent from the client or server component,
   * and based on that, the refererUrl is created
   */
  if (typeof window !== "undefined") {
    device_token = getDeviceToken();
    customer_token = getCustomerToken();
    refererUrl = window.location.href;
  } else {
    const { cookies, headers } = await import("next/headers");
    device_token =
      cookies().get("device_token")?.value || generateDeviceToken();
    customer_token = cookies().get("customer_token")?.value || device_token;
    const headersList = headers();
    const pathname = headersList.get("x-pathname") || "/";
    if (pathname.match(/\.(css|js|map|mjs|json)$/)) refererUrl = null;
    refererUrl = pathname;
  }

  /**
   * Based on whether we are in test mode, the referer url is updated
   */
  if (process.env.NEXT_PUBLIC_URL_STRUCTURE_MODE === "test") {
    if (refererUrl.startsWith("http")) {
      refererUrl = new URL(refererUrl).pathname;
    }
    if (refererUrl.startsWith("/")) {
      refererUrl = refererUrl.slice(1);
    }
  }

  try {
    const response = await axios({
      method: method,
      url: process.env.API_URL + path.replace(/^\//, ""),
      headers: {
        "device-token": device_token,
        "customer-token": token ?? customer_token,
        "referer-url": refererUrl,
      },
      data: payload,
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const get = async (path, customer_token = null) => {
  return makeRequest("GET", path, null, customer_token);
};

export const put = async (path, payload) => {
  return makeRequest("PUT", path, payload);
};

export const post = async (path, payload) => {
  return makeRequest("POST", path, payload);
};

export const list = async (path, payload, id) => {
  return makeRequest("LIST", path, { ...payload, id });
};

export const deleteMethod = async (path) => {
  return makeRequest("DELETE", path);
};

export const fetch = async (path, payload) => {
  return makeRequest("FETCH", path, payload);
};
