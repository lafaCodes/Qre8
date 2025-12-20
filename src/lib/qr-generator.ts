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

// URL/Text - Simple passthrough
function generateUrlString(data: UrlData): string {
  return data.content;
}

// WiFi - WIFI:T:WPA;S:network;P:password;H:hidden;;
function generateWifiString(data: WifiData): string {
  const escape = (str: string) => str.replace(/([\\;,:"'])/g, "\\$1");
  
  let result = "WIFI:";
  result += `T:${data.encryption};`;
  result += `S:${escape(data.ssid)};`;
  
  if (data.password && data.encryption !== "nopass") {
    result += `P:${escape(data.password)};`;
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

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  lines.push(`FN:${fullName}`);
  lines.push(`N:${data.lastName || ""};${data.firstName};;;`);

  if (data.phone) {
    lines.push(`TEL:${data.phone}`);
  }

  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  if (data.address) {
    lines.push(`ADR:;;${data.address};;;;`);
  }

  lines.push("END:VCARD");
  return lines.join("\n");
}

// mailto: format
function generateEmailString(data: EmailData): string {
  let result = `mailto:${data.email}`;
  const params: string[] = [];

  if (data.subject) {
    params.push(`subject=${encodeURIComponent(data.subject)}`);
  }

  if (data.body) {
    params.push(`body=${encodeURIComponent(data.body)}`);
  }

  if (params.length > 0) {
    result += `?${params.join("&")}`;
  }

  return result;
}

// sms: or smsto: format
function generateSmsString(data: SmsData): string {
  let result = `sms:${data.phone}`;
  
  if (data.message) {
    result += `?body=${encodeURIComponent(data.message)}`;
  }

  return result;
}

// tel: format
function generatePhoneString(data: PhoneData): string {
  return `tel:${data.phone}`;
}

// geo: format
function generateGeoString(data: GeoData): string {
  return `geo:${data.latitude},${data.longitude}`;
}

// iCalendar VEVENT format
function generateEventString(data: EventData): string {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const lines: string[] = [
    "BEGIN:VEVENT",
    `SUMMARY:${data.title}`,
    `DTSTART:${formatDate(data.startDate)}`,
    `DTEND:${formatDate(data.endDate)}`,
  ];

  if (data.location) {
    lines.push(`LOCATION:${data.location}`);
  }

  if (data.description) {
    lines.push(`DESCRIPTION:${data.description}`);
  }

  lines.push("END:VEVENT");
  return lines.join("\n");
}

// Sanitize input to prevent injection attacks
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}
