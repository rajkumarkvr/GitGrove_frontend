import { useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useUserProfile } from "../Contexts/UserContext";

const refreshCurrentUser = async () => {
  const { currentUser, setCurrentUser } = useUserProfile();
  useEffect(() => {
    const fetchProfile = async () => {
      //Need to change the current user
      const response = await axiosInstance.post("user/profile", {
        id: currentUser.id,
      });
      console.log(response.data.response);
      if (response.data) {
        const userData = {
          id: response.data.response._id,
          name: response.data.response.name,
          username: response.data.response.username,
          gender: response.data.response.gender,
          profilePic: response.data.response.userProfile,
          posts: response.data.response.posts,
        };
        localStorage.setItem("_user", JSON.stringify(userData));
        setCurrentUser(JSON.parse(localStorage.getItem("_user")));
      }
    };
    fetchProfile();
  }, []);
};
export default refreshCurrentUser;
