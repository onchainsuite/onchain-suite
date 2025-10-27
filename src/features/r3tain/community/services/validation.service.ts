// Centralized validation service following Single Responsibility Principle
export class ValidationService {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email.trim());
  }

  static validateFileType(file: File): ValidationResult {
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

    const maxSizeCSV = 100 * 1024 * 1024; // 100MB
    const maxSizeXLSX = 50 * 1024 * 1024; // 50MB

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

  static validateCSVData(csvText: string): ValidationResult {
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

    const headers = lines[0].split(",").map((h) => h.trim());
    if (!headers.some((h) => h.toLowerCase().includes("email"))) {
      result.warnings.push(
        "No email column detected. Make sure you have an email field."
      );
    }

    const dataRows = this.parseDataRows(lines.slice(1), headers);
    result.data = dataRows.data;
    result.warnings.push(...dataRows.warnings);

    return result;
  }

  private static parseDataRows(lines: string[], headers: string[]) {
    const data: Record<string, string>[] = [];
    const warnings: string[] = [];

    lines.forEach((line, index) => {
      const row = line.split(",").map((cell) => cell.trim());

      if (row.length !== headers.length) {
        warnings.push(
          `Row ${index + 2} has ${row.length} columns but header has ${headers.length}`
        );
      }

      const rowData: Record<string, string> = {};
      headers.forEach((header, headerIndex) => {
        rowData[header] = row[headerIndex] || "";
      });

      // Validate emails in this row
      const emailColumns = headers.filter((h) =>
        h.toLowerCase().includes("email")
      );
      emailColumns.forEach((emailCol) => {
        const email = rowData[emailCol];
        if (email && !this.validateEmail(email)) {
          warnings.push(`Invalid email "${email}" in row ${index + 2}`);
        }
      });

      data.push(rowData);
    });

    return { data, warnings };
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: unknown[];
}
