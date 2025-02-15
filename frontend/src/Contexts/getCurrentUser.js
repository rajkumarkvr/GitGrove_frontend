function getCurrentUser() {
  const user = localStorage.getItem("_user");
  if (user != null) return JSON.parse(user);
  return null;
}

export default getCurrentUser;
