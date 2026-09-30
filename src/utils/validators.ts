export const validateRegisterInput = (body: any): string | null => {
  const { username, password, fullName } = body;
  if (!username || typeof username !== "string" || username.trim().length < 3) {
    return "Username must be at least 3 characters long.";
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return "Full name must be at least 2 characters long.";
  }
  return null;
};

export const validateLoginInput = (body: any): string | null => {
  const { username, password } = body;
  if (!username || typeof username !== "string") {
    return "Username is required.";
  }
  if (!password || typeof password !== "string") {
    return "Password is required.";
  }
  return null;
};
