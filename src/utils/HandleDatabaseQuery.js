const handleDatabaseQuery = handler => {
  return response => {
    try {
      handler.json(response);
    } catch (err) {
      handler.status(400).json({ errorMessage: "Bad request" });
    }
  };
};

module.exports = handleDatabaseQuery;
