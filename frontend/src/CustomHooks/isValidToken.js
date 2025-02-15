export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const base64Url = token.split(".")[1]; // Extract payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Fix base64 encoding
    const payload = JSON.parse(atob(base64)); // Decode payload

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    return payload.exp && payload.exp > currentTime; // Token is valid if expiration time > current time
  } catch (error) {
    console.error("Invalid token:", error);
    return false; // If token is malformed
  }
};
