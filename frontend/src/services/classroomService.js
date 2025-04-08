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
    body: JSON.stringify({code}),
  });
  const data = await response.json()
  return data;
};


export const listClassroom = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/classroom/list`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    });
    const data = await response.json();
    return data
}