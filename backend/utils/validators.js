// validators.js

// Validate email format
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate required fields (e.g., for creating a new user or product)
  exports.validateRequiredFields = (fields, requiredFields) => {
    for (let i = 0; i < requiredFields.length; i++) {
      if (!fields[requiredFields[i]]) {
        return false;
      }
    }
    return true;
  };
  
  // Validate if a password meets complexity criteria
  exports.isStrongPassword = (password) => {
    return password.length >= 8; // Add additional rules as needed (e.g., numbers, special characters)
  };