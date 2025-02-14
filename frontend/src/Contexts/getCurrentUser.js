function getCurrentUser() {
  return JSON.parse(localStorage.getItem("_user"));
}

export default getCurrentUser;
