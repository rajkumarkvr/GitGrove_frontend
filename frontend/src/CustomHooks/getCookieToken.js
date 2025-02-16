import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import getCurrentUser from "../Contexts/getCurrentUser";

const useAuthCookie = () => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    console.log(currentUser.username);
    const token = Cookies.get("gitgrove_" + currentUser.username); // Directly gets the cookie
    if (token) setAuthToken(token);
  }, []);

  return authToken;
};

export default useAuthCookie;
