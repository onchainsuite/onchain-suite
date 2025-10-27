export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = ["text/csv", "text/plain", "application/vnd.ms-excel"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (
    !allowedTypes.includes(file.type) &&
    !file.name.endsWith(".csv") &&
    !file.name.endsWith(".txt")
  ) {
    return { valid: false, error: "Only CSV and text files are allowed" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  return { valid: true };
};

export const parseEmailsFromContent = (
  content: string
): { emails: string[]; errors: string[] } => {
  const lines = content.split("\n");
  const emails: string[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const possibleEmail = trimmedLine.split(",")[0].trim();
      if (validateEmail(possibleEmail)) {
        emails.push(possibleEmail);
      } else {
        errors.push(
          `Line ${index + 1}: Invalid email format "${possibleEmail}"`
        );
      }
    }
  });

  return { emails, errors };
};
