import getCurrentUser from "../Contexts/getCurrentUser";

function getToken() {
  // Get current user
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.username) {
    console.error("User is not logged in or email is missing.");
    return null;
  }

  const cookieKey = `gitgrove_${currentUser.username}`;

  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === cookieKey) {
      return decodeURIComponent(value);
    }
  }

  console.warn("Token not found in cookies.");
  return null;
}

export default getToken;
