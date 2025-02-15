import getCurrentUser from "../Contexts/getCurrentUser";
import getToken from "./getAuthToken";

function clearCookieAndCurrentUser() {
  if (getToken()) {
    const cookieKey = `gitgrove_${getCurrentUser().username}`;
    document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;

    localStorage.removeItem("_user");
    console.log("Cookie cleared& current user cleared");
  }
}

export default clearCookieAndCurrentUser;
