import {
  UrlData,
  WifiData,
  ContactData,
  EmailData,
  SmsData,
  PhoneData,
  GeoData,
  EventData,
  QRData,
} from "./qr-types";

/**
 * Security: Sanitize input to prevent XSS and injection attacks
 * Removes script tags and HTML elements
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
    .trim();
}

/**
 * Security: Escape special characters for WiFi QR format
 * Handles backslash, semicolon, comma, colon, quotes, and control characters
 */
function escapeWifi(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")      // Escape backslashes first
    .replace(/;/g, "\\;")        // Escape semicolons
    .replace(/,/g, "\\,")        // Escape commas
    .replace(/:/g, "\\:")        // Escape colons
    .replace(/"/g, '\\"')        // Escape double quotes
    .replace(/'/g, "\\'")        // Escape single quotes
    .replace(/[\n\r]/g, "")      // Remove newlines (not allowed in WiFi SSID/password)
    .replace(/[\x00-\x1F\x7F]/g, ""); // Remove control characters
}

/**
 * Security: Escape special characters for vCard format
 * Handles newlines, semicolons, commas, and backslashes per RFC 6350
 */
function escapeVCard(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")      // Escape backslashes first
    .replace(/;/g, "\\;")        // Escape semicolons
    .replace(/,/g, "\\,")        // Escape commas
    .replace(/\n/g, "\\n")       // Escape newlines
    .replace(/\r/g, "")          // Remove carriage returns
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""); // Remove control characters
}

/**
 * Security: Escape special characters for iCalendar format
 * Handles newlines, semicolons, commas, and backslashes per RFC 5545
 */
function escapeICal(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")      // Escape backslashes first
    .replace(/;/g, "\\;")        // Escape semicolons
    .replace(/,/g, "\\,")        // Escape commas
    .replace(/\n/g, "\\n")       // Escape newlines
    .replace(/\r/g, "")          // Remove carriage returns
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""); // Remove control characters
}

/**
 * Security: Sanitize phone numbers
 * Only allows digits, plus sign, spaces, dashes, and parentheses
 */
function sanitizePhone(phone: string): string {
  if (!phone) return "";
  return phone.replace(/[^\d+\s\-().]/g, "");
}

/**
 * Generate the proper string format for each QR code type
 * These formats follow standard specifications that mobile devices recognize
 */

export function generateQRString(data: QRData): string {
  switch (data.type) {
    case "url":
      return generateUrlString(data);
    case "wifi":
      return generateWifiString(data);
    case "contact":
      return generateContactString(data);
    case "email":
      return generateEmailString(data);
    case "sms":
      return generateSmsString(data);
    case "phone":
      return generatePhoneString(data);
    case "geo":
      return generateGeoString(data);
    case "event":
      return generateEventString(data);
    default:
      return "";
  }
}

// URL/Text - Sanitize but preserve URLs
function generateUrlString(data: UrlData): string {
  // For URLs, we just trim and remove control characters
  // We don't want to break valid URL characters
  return data.content
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

// WiFi - WIFI:T:WPA;S:network;P:password;H:hidden;;
function generateWifiString(data: WifiData): string {
  let result = "WIFI:";
  result += `T:${data.encryption};`;
  result += `S:${escapeWifi(data.ssid)};`;
  
  if (data.password && data.encryption !== "nopass") {
    result += `P:${escapeWifi(data.password)};`;
  }
  
  if (data.hidden) {
    result += "H:true;";
  }
  
  result += ";";
  return result;
}

// vCard 3.0 format for contacts
function generateContactString(data: ContactData): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
  ];

  const firstName = escapeVCard(sanitizeInput(data.firstName));
  const lastName = escapeVCard(sanitizeInput(data.lastName || ""));
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  
  lines.push(`FN:${fullName}`);
  lines.push(`N:${lastName};${firstName};;;`);

  if (data.phone) {
    lines.push(`TEL:${sanitizePhone(data.phone)}`);
  }

  if (data.email) {
    lines.push(`EMAIL:${escapeVCard(data.email)}`);
  }

  if (data.company) {
    lines.push(`ORG:${escapeVCard(sanitizeInput(data.company))}`);
  }

  if (data.title) {
    lines.push(`TITLE:${escapeVCard(sanitizeInput(data.title))}`);
  }

  if (data.website) {
    lines.push(`URL:${data.website.trim()}`);
  }

  if (data.address) {
    lines.push(`ADR:;;${escapeVCard(sanitizeInput(data.address))};;;;`);
  }

  lines.push("END:VCARD");
  return lines.join("\n");
}

// mailto: format
function generateEmailString(data: EmailData): string {
  let result = `mailto:${data.email.trim()}`;
  const params: string[] = [];

  if (data.subject) {
    params.push(`subject=${encodeURIComponent(sanitizeInput(data.subject))}`);
  }

  if (data.body) {
    params.push(`body=${encodeURIComponent(sanitizeInput(data.body))}`);
  }

  if (params.length > 0) {
    result += `?${params.join("&")}`;
  }

  return result;
}

// sms: format
function generateSmsString(data: SmsData): string {
  let result = `sms:${sanitizePhone(data.phone)}`;
  
  if (data.message) {
    result += `?body=${encodeURIComponent(sanitizeInput(data.message))}`;
  }

  return result;
}

// tel: format
function generatePhoneString(data: PhoneData): string {
  return `tel:${sanitizePhone(data.phone)}`;
}

// geo: format - coordinates are validated at schema level
function generateGeoString(data: GeoData): string {
  // Additional runtime validation
  const lat = parseFloat(data.latitude);
  const lon = parseFloat(data.longitude);
  
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error("Invalid coordinates");
  }
  
  return `geo:${lat},${lon}`;
}

// iCalendar VEVENT format
function generateEventString(data: EventData): string {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const lines: string[] = [
    "BEGIN:VEVENT",
    `SUMMARY:${escapeICal(sanitizeInput(data.title))}`,
    `DTSTART:${formatDate(data.startDate)}`,
    `DTEND:${formatDate(data.endDate)}`,
  ];

  if (data.location) {
    lines.push(`LOCATION:${escapeICal(sanitizeInput(data.location))}`);
  }

  if (data.description) {
    lines.push(`DESCRIPTION:${escapeICal(sanitizeInput(data.description))}`);
  }

  lines.push("END:VEVENT");
  return lines.join("\n");
}
