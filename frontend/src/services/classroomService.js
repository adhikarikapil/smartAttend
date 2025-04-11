const API_URL = import.meta.env.VITE_API_URL;

export const createClassroom = async (className, code, description) => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/classroom/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ className, code, description }),
  });

  const data = await response.json();
  return data;
};

export const joinClassroom = async (code) => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/classroom/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ code }),
  });
  const data = await response.json();
  return data;
};

export const classroomList = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/classroom/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};

export const leaveClassroom = async (classroomId) => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/classroom/leave/${classroomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = response.json();
  return data;
};

export const dismissClassroom = async (classroomId) => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/classroom/dismiss/${classroomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};

export const listStudent = async (classroomId) => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await fetch(`${API_URL}/classroom/list/${classroomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};

export const removeStudent = async (classroomId, userId) => {
  const accessToken = localStorage.getItem('accessToken')
  const response = await fetch(`${API_URL}/classroom/remove/${classroomId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ userId }),
  });
  const data = await response.json();
  return data;
};
