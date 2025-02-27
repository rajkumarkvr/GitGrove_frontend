import validateUsername from "../../CustomHooks/validateUsername";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateRegistrationData(user, setErrors) {
  let errors = {};

  let result = validateUsername(user.username);
  if (!result.isValid) {
    errors.username = result.message;
  }

  if (!user.email.trim()) {
    errors.email = "Email address required";
  } else if (!emailRegex.test(user.email)) {
    errors.email = "Invalid email address";
  }
  if (!user.password.trim() || !user.confirmPassword.trim()) {
    errors.password = "Password required";
  } else if (user.confirmPassword != user.password) {
    errors.confirmPassword = "Passwords do not match";
  } else if (user.password.length < 8) {
    errors.confirmPassword = "password must have eight characters";
  }
  setErrors(errors);
  return Object.keys(errors).length === 0;
}

export default validateRegistrationData;
