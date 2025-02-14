import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../CustomHooks/OwnLocalStorage";

const UserContext = createContext(null);

//To get user data from this context
export const useUserProfile = () => {
  return useContext(UserContext);
};
function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [storedValue, setStoredValue] = useLocalStorage("_user", {});

  useEffect(() => {
    setCurrentUser(storedValue);
  }, []);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
