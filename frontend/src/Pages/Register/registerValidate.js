import validateUsername from "../../CustomHooks/validateUsername";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateRegistrationData(user, setErrors) {
  let errors = {};

  let result = validateUsername(user.username);
  if (!result.isValid) {
    errors.username = result.message;
  }

  if (!user.email.trim()) {
    errors.email = "Email address is required";
  } else if (!emailRegex.test(user.email)) {
    errors.email = "Invalid email address";
  }
  if (!user.password.trim() || !user.confirmPassword.trim()) {
    errors.password = "Password is required";
  } else if (user.confirmPassword != user.password) {
    errors.confirmPassword = "Passwords do not match";
  } else if (user.password.length < 8) {
    errors.confirmPassword = "Password must be at least 8 characters long";
  }
  setErrors(errors);
  return Object.keys(errors).length === 0;
}

export default validateRegistrationData;
