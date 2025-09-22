export const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
};
