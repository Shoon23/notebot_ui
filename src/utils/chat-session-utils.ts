const generateNewChatSession = () => {
  const sessionId = Math.random().toString(36).substring(2); // Unique session ID
  const createdAt = Date.now(); // Current timestamp in milliseconds
  const expiresAt = createdAt + 5 * 60 * 60 * 1000; // 5 hours from now in milliseconds

  return {
    sessionId,
    expiresAt,
  };
};
