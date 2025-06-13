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
    localStorage.setItem("userData", JSON.stringify(data.user));

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
    return;
  }

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

    if (response.ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } else {
      console.error("Failed to logout:", data.error);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
    return { error: "Logout failed" };
  }
};

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.log("No refresh token found, logging out.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    return { success: false, error: "Refresh token missing" };
  }

  try {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();

    if (response.ok && data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
      return { success: true, accessToken: data.accessToken };
  } else {
      console.log("Refresh token call failed:", data.error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      return { success: false, error: data.error || "Refresh token call failed" };
    }
  } catch (error) {
    console.log("Refresh token call failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    return { success: false, error: "Refresh token call failed" };
  }
}

export const isTokenExpired = async () => {
  try {
  const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return await refreshAccessToken();
    }

    const currentTime = new Date().getTime() / 1000;
  const decodedToken = jwtDecode(accessToken);

  if (decodedToken.exp < currentTime) {
      return await refreshAccessToken();
    }
    return { success: true };
  } catch (error) {
    console.error("Token validation failed:", error);
    return await refreshAccessToken();
  }
};
