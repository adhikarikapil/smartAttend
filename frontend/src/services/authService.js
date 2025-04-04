import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

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

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.error("No refresh token available!!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await response.json();

  if (response.status == 201 || response.ok) {
    localStorage.setItem("accessToken", data.accessToken);
  } else {
    console.error("Cannot get new token, Login Again!!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
};

export const isTokenExpired = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const currentTime = new Date().getTime() / 1000; // In seconds
  const decodedToken = jwtDecode(accessToken);

  if (decodedToken.exp < currentTime) {
    refreshAccessToken();
    console.log("token got refreshed");
  }
};
