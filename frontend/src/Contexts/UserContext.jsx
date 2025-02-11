import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

//To get user data from this context
export const useUserProfile = () => {
  return useContext(UserContext);
};
function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("_user") || null));
  }, []);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
