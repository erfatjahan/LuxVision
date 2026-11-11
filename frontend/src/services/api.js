const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function enhanceImageAPI(file, token) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/image/enhance`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Enhancement failed");
  return res.json();
}
export async function initPaymentAPI(planData, token) {
  const res = await fetch(`${API_URL}/api/payment/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(planData),
  });
  
  if (!res.ok) throw new Error("Payment initialization failed");
  return res.json();
}