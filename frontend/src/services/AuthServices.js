import React from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const LoginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.status == 200 || response.status == 201) {
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    }
    return data;
  } catch (error) {
    console.error("login failed: ", error);
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();

    if (response.status == 200 || response.status == 201) {
      if (data.refreshToken) {
        localStorage.setItem("accessToken", data.refreshToken);
      }
    }
    return data;
  } catch (error) {
    console.error("Token refresh failed: ", error);
  }
};

export const Logout = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);

    return { error: "No Token Found!!!" };
  } else {
    try {
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
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return {'message': 'Logout Successfull!!'}
      }
      return data;
    } catch (error) {
      console.error("Logout failed: ", error);
      return {'error': 'Logout failed'}
    }
  }
};
