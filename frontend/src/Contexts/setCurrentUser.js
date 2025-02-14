function setCurrentUser(user) {
  localStorage.setItem("_user", JSON.stringify(user));
}

export default setCurrentUser;
