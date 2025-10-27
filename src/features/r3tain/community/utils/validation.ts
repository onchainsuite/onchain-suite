// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: unknown[];
}

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validateCSVData(csvText: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    data: [],
  };

  if (!csvText.trim()) {
    result.isValid = false;
    result.errors.push("No data provided");
    return result;
  }

  const lines = csvText.trim().split("\n");
  if (lines.length < 2) {
    result.isValid = false;
    result.errors.push("At least a header row and one data row are required");
    return result;
  }

  // Parse header
  const headers = lines[0].split(",").map((h) => h.trim());
  if (!headers.some((h) => h.toLowerCase().includes("email"))) {
    result.warnings.push(
      "No email column detected. Make sure you have an email field."
    );
  }

  // Parse data rows
  const dataRows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((cell) => cell.trim());
    if (row.length !== headers.length) {
      result.warnings.push(
        `Row ${i + 1} has ${row.length} columns but header has ${headers.length}`
      );
    }

    const rowData: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || "";
    });

    // Validate emails in this row
    const emailColumns = headers.filter((h) =>
      h.toLowerCase().includes("email")
    );
    emailColumns.forEach((emailCol) => {
      const email = rowData[emailCol];
      if (email && !validateEmail(email)) {
        result.warnings.push(`Invalid email "${email}" in row ${i + 1}`);
      }
    });

    dataRows.push(rowData);
  }

  result.data = dataRows;
  return result;
}

export function validateFileType(file: File): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  const allowedTypes = [".csv", ".txt", ".xlsx"];
  const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

  if (!allowedTypes.includes(fileExtension)) {
    result.isValid = false;
    result.errors.push(
      `File type ${fileExtension} is not supported. Please use CSV, TXT, or XLSX files.`
    );
  }

  // Check file size limits
  const maxSizeCSV = 100 * 1024 * 1024; // 100MB for CSV/TXT
  const maxSizeXLSX = 50 * 1024 * 1024; // 50MB for XLSX

  if (fileExtension === ".xlsx" && file.size > maxSizeXLSX) {
    result.isValid = false;
    result.errors.push("XLSX files must be smaller than 50MB");
  } else if (
    (fileExtension === ".csv" || fileExtension === ".txt") &&
    file.size > maxSizeCSV
  ) {
    result.isValid = false;
    result.errors.push("CSV and TXT files must be smaller than 100MB");
  }

  return result;
}
