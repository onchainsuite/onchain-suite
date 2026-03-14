# Azure Domain Verification & Sender Management UI Sketches

## Overview

This document outlines the UI/UX implementation for the Azure Domain Verification and Sender
Management features.

### 1. Domain List & Status

- **Component**: `SenderVerification`
- **Layout**: List of domains with status badges (Verified, Pending, Failed).
- **Interactions**:
  - "Add Domain" button triggers modal.
  - Expand domain row to see associated sender identities.
  - "Verify" button for pending domains triggers verification check.
  - "DNS Records" button shows required DNS entries.

### 2. Add Domain Modal

- **Input**: Domain name (e.g., `example.com`).
- **Service Selection**: "Azure Communication Services" (default/fixed for now).
- **Validation**: Regex check for valid domain format.
- **Action**: `POST /api/v1/domain`

### 3. DNS Verification Modal

- **Display**: List of required DNS records (TXT, CNAME).
- **Features**:
  - Copy-to-clipboard for each record value.
  - "Auto-configure" button for supported providers (GoDaddy, Cloudflare) -
    `POST /api/v1/domain/{id}/dns/auto`.
  - "Verify Now" button to trigger re-check - `POST /api/v1/domain/{id}/recheck`.

### 4. Sender Identity Management

- **Context**: Senders are nested under verified domains.
- **Input**: Username (e.g., `notifications` for `notifications@example.com`), Display Name.
- **Action**: `POST /api/v1/sender-identities`.

---

# File Upload Integration Guide

This guide details the comprehensive implementation of file upload functionality across the
platform, including Organization Branding and Audience Management.

## 1. Global Technical Requirements

### Supported Features

- **Drag-and-Drop**: Native HTML5 drag-and-drop with visual feedback (hover states).
- **Preview**: Client-side preview for images before upload.
- **Progress Tracking**: Real-time progress bars using `axios` `onUploadProgress`.
- **Cancellation**: Abortable requests using `AbortController`.
- **Retry Mechanism**: Exponential backoff for failed network requests.
- **Security**:
  - Client-side validation (File type, Magic bytes check recommended).
  - Server-side validation (MIME type, Content analysis).
  - CSRF protection via standard headers.

### User Experience

- **Feedback**: Immediate success/error toast notifications.
- **Validation**: Clear warnings for file size or type mismatch _before_ upload starts.
- **Responsiveness**: Mobile-friendly touch targets for file selection.

## 2. Organization Branding

### Endpoints

- **Primary Logo**: `POST /api/v1/organization/branding/logo/primary`
- **Dark Mode Logo**: `POST /api/v1/organization/branding/logo/dark`
- **Favicon**: `POST /api/v1/organization/branding/logo/favicon`

### Specifications

| Feature           | Requirement                                                               |
| :---------------- | :------------------------------------------------------------------------ |
| **Max Size**      | 100 MB (Hard limit)                                                       |
| **Allowed Types** | **Logos**: `.png`, `.jpg`, `.jpeg`, `.svg`<br>**Favicon**: `.ico`, `.png` |
| **Dimensions**    | **Logos**: Recommended 400x100px<br>**Favicon**: 32x32px                  |
| **Method**        | `multipart/form-data`                                                     |
| **Field Name**    | `file`                                                                    |

### Implementation Details (Reference: `LogoUpload`)

- Uses a proxy route `/api/upload/logo/[type]` to forward requests to the backend.
- **Header**: `x-org-id` is required for organization context.
- **Error Handling**: Handles `413 Payload Too Large` and `415 Unsupported Media Type` specifically.

## 3. Audience Import

### Endpoints

- **Upload**: `POST /api/v1/audience/import/upload`

### Specifications

| Feature           | Requirement                                    |
| :---------------- | :--------------------------------------------- |
| **Max Size**      | 50 MB                                          |
| **Allowed Types** | `.csv` (Comma Separated), `.json` (JSON Array) |
| **MIME Types**    | `text/csv`, `application/json`                 |
| **Method**        | `multipart/form-data`                          |

### Implementation Logic

1.  **Client-Side Parsing (Preview)**: Parse CSV/JSON locally to allow column mapping _before_
    upload.
2.  **Mapping Step**: User maps CSV headers to system fields (Email, Name, Wallet).
3.  **Upload**: Submit the file _after_ mapping is confirmed (or submit file + mapping config).

## 4. Campaign Media (Future/Proposed)

### Endpoints

- **Upload**: `POST /api/v1/campaigns/media/upload`

### Specifications

| Feature           | Requirement                                                             |
| :---------------- | :---------------------------------------------------------------------- |
| **Max Size**      | 500 MB (Video), 50 MB (Image)                                           |
| **Allowed Types** | **Video**: `.mp4`, `.mov`, `.webm`<br>**Image**: `.png`, `.jpg`, `.gif` |
| **Method**        | Resumable Upload (Chunked) recommended for files > 50MB.                |

## 5. Implementation Reference (React/Axios)

```typescript
import axios from "axios";

interface UploadConfig {
  endpoint: string;
  file: File;
  orgId: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

export async function uploadFile({ endpoint, file, orgId, onProgress, signal }: UploadConfig) {
  // 1. Client-Side Validation
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB
  if (file.size > MAX_SIZE) throw new Error("File too large");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-org-id": orgId,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
      signal, // AbortController signal
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Upload canceled");
    }
    throw error;
  }
}
```

## 6. Testing Requirements

### Scenarios

1.  **Success**: valid file, valid size, good network.
2.  **Validation Error**:
    - Invalid file type (e.g., uploading `.exe`).
    - File size > Limit.
3.  **Network Failure**:
    - Disconnect network during upload (should trigger retry or clear error).
    - Server 500 error (should show generic "Try again" message).
4.  **Cancellation**: User clicks "Cancel" during upload (request aborts immediately).
5.  **Cross-Browser**: Verify drag-and-drop on Chrome, Firefox, Safari, and Edge.

### Mobile Specifics

- Ensure `<input type="file">` accepts camera/gallery on iOS/Android.
- Verify tap targets are at least 44x44px.
