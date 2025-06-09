import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;
const REFRESH_TOKEN_URL = "http://localhost:5000/api/auth/refresh";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  } else {
    console.error(data.error);
  }
  return data;
};

export const logoutUser = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    console.error("No tokens available!!!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ accessToken, refreshToken }),
  });
  const data = await response.json();

  if (response.status == 200 || response.status == 201) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } else {
    console.error("Failed to logout!!!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
  return data;
};

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.log("No refresh token found, logging out.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return { success: false, error: "Refresh token missing" };
  }
  try {
    const res = await fetch(REFRESH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    const data = await res.json();
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return { success: true, accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user };
    } else {
      console.log("Refresh token call did not return a new access token, logging out.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return { success: false, error: "Refresh token call did not return a new access token" };
    }
  } catch {
    console.log("Refresh token call failed, logging out.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return { success: false, error: "Refresh token call failed" };
  }
}

export const isTokenExpired = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const currentTime = new Date().getTime() / 1000;
  const decodedToken = jwtDecode(accessToken);

  if (decodedToken.exp < currentTime) {
    refreshAccessToken();
    console.log("token got refreshed");
  }
};
