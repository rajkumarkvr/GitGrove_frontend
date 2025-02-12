function validateLoginData(user, setErrors) {
  let errors = {};

  if (!user.identifier.trim()) {
    errors.identifier = "Username or email is required";
  }
  if (!user.password.trim()) {
    errors.password = "Password is required";
  }

  setErrors(errors);
  return Object.keys(errors).length === 0;
}
export default validateLoginData;
