function validateUsername(username) {
  let minLength = 3;
  let maxLength = 20;
  let usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  if (!username || username.trim() === "") {
    return {
      isValid: false,
      message: "Username cannot be empty",
    };
  }

  if (username.length < minLength) {
    return {
      isValid: false,
      message: `Username must be at least ${minLength} characters long`,
    };
  }
  if (username.length > maxLength) {
    return {
      isValid: false,
      message: `Username cannot exceed ${maxLength} characters`,
    };
  }
  if (username.includes(" ")) {
    return {
      isValid: false,
      message: "Username cannot contain spaces",
    };
  }

  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message:
        "Username can only contain alphanumeric characters, underscores, and must start with a letter",
    };
  }
  return { isValid: true, message: "" };
}

export default validateUsername;
