// helperFunctions.js

// Format a date to a readable string
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  // Helper for sending error responses
  exports.sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({ message });
  };
  
  // Function to generate a random unique ID (e.g., for loan IDs)
  exports.generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 9);
  };