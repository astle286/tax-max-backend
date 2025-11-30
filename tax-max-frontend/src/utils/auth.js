export function login(token, role) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role.toLowerCase()); // ✅ normalize
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserRole() {
  const role = localStorage.getItem("role");
  return role ? role.toLowerCase() : null; // ✅ normalize
}

export function isAuthenticated() {
  return !!getToken();
}
