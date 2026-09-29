export function validateName(name) {
  if (!name || name.length < 20 || name.length > 60) {
    return 'Name must be 20 to 60 characters';
  }
  return null;
}

export function validateAddress(address) {
  if (!address || address.length > 400) {
    return 'Address must be up to 400 characters';
  }
  return null;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !re.test(email)) {
    return 'Invalid email address';
  }
  return null;
}

export function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be 8 to 16 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
}
