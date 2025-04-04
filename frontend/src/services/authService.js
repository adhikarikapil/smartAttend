const API_URL = import.meta.env.VITE_API_URL;

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
  console.log(data);

  if (response.status == 200 || response.status == 201) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  } else {
    console.error("Failed to logout!!!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }
};

export const checkToken = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("No access token");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  }

  console.log("Sending token:", accessToken);

  const response = await fetch(`${API_URL}/auth/token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data)
  if (response.status == 200) {
    console.log(data);
  } else {
    console.error("Cannot check Token");
  }
};
