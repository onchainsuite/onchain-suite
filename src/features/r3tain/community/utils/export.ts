import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import type { Subscriber } from "@/r3tain/community/types";

export function exportToCSV(
  subscribers: Subscriber[],
  filename = "subscribers.csv"
) {
  const headers = [
    "Email",
    "First Name",
    "Last Name",
    "Address",
    "Phone Number",
    "Birthday",
    "Company",
    "Tags",
    "Email Marketing",
    "Source",
    "Rating",
    "Subscriber Date Added",
    "Last Changed",
  ];

  const csvContent = [
    headers.join(","),
    ...subscribers.map((subscriber) =>
      [
        `"${subscriber.email}"`,
        `"${subscriber.firstName ?? ""}"`,
        `"${subscriber.lastName ?? ""}"`,
        `"${subscriber.address?.replace(/\n/g, " ") ?? ""}"`,
        `"${subscriber.phoneNumber ?? ""}"`,
        `"${subscriber.birthday ?? ""}"`,
        `"${subscriber.company ?? ""}"`,
        `"${subscriber.tags.join("; ")}"`,
        `"${subscriber.emailMarketing}"`,
        `"${subscriber.source}"`,
        `"${subscriber.rating}"`,
        `"${new Date(subscriber.contactDateAdded).toLocaleString()}"`,
        `"${new Date(subscriber.lastChanged).toLocaleString()}"`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToPDF(
  subscribers: Subscriber[],
  filename = "subscribers.pdf"
) {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Subscribers Report", 14, 22);

  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
  doc.text(`Total Subscribers: ${subscribers.length}`, 14, 40);

  // Prepare table data
  const tableData = subscribers.map((subscriber) => [
    subscriber.email,
    subscriber.firstName ?? "",
    subscriber.lastName ?? "",
    subscriber.company ?? "",
    subscriber.tags.join(", "),
    subscriber.emailMarketing,
    subscriber.source,
    subscriber.rating.toString(),
    new Date(subscriber.contactDateAdded).toLocaleDateString(),
  ]);

  // Add table
  autoTable(doc, {
    head: [
      [
        "Email",
        "First Name",
        "Last Name",
        "Company",
        "Tags",
        "Email Marketing",
        "Source",
        "Rating",
        "Date Added",
      ],
    ],
    body: tableData,
    startY: 50,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Email
      1: { cellWidth: 20 }, // First Name
      2: { cellWidth: 20 }, // Last Name
      3: { cellWidth: 25 }, // Company
      4: { cellWidth: 30 }, // Tags
      5: { cellWidth: 25 }, // Email Marketing
      6: { cellWidth: 25 }, // Source
      7: { cellWidth: 15 }, // Rating
      8: { cellWidth: 20 }, // Date Added
    },
  });

  doc.save(filename);
}
