export const validateRegisterInput = (body: any): string | null => {
  const { username, password, fullName, email, mobile } = body || {};
  if (typeof username !== "string" || !/^[A-Za-z0-9_]{3,32}$/.test(username.trim())) {
    return "Username must be 3–32 letters, numbers, or underscores.";
  }
  if (typeof password !== "string" || password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must be at least 10 characters with a letter and a number.";
  }
  if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 100) {
    return "Full name must be 2–100 characters long.";
  }
  if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
  if (typeof mobile !== "string" || !/^\+[1-9]\d{7,14}$/.test(mobile.trim())) return "Enter a mobile number in international format, such as +8801712345678.";
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
