
export const validateEmail = (email) => {
  if (!email) {
    return "Email is required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  // Add more complex password validation as needed
  // For example, require numbers, symbols, or uppercase letters
  return "";
};

export const validateName = (name) => {
  if (!name) {
    return "Name is required.";
  }
  return "";
};
