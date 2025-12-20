import { z } from "zod";

// URL/Text QR Code Schema
export const urlSchema = z.object({
  type: z.literal("url"),
  content: z.string().min(1, "Content is required"),
});

// WiFi QR Code Schema
export const wifiSchema = z.object({
  type: z.literal("wifi"),
  ssid: z.string().min(1, "Network name is required"),
  password: z.string().optional(),
  encryption: z.enum(["WPA", "WEP", "nopass"]),
  hidden: z.boolean(),
});

// Contact (vCard) QR Code Schema
export const contactSchema = z.object({
  type: z.literal("contact"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().optional(),
  title: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
});

// Email QR Code Schema
export const emailSchema = z.object({
  type: z.literal("email"),
  email: z.string().email("Valid email is required"),
  subject: z.string().optional(),
  body: z.string().optional(),
});

// SMS QR Code Schema
export const smsSchema = z.object({
  type: z.literal("sms"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().optional(),
});

// Phone Call QR Code Schema
export const phoneSchema = z.object({
  type: z.literal("phone"),
  phone: z.string().min(1, "Phone number is required"),
});

// Geo Location QR Code Schema
export const geoSchema = z.object({
  type: z.literal("geo"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
});

// Event (Calendar) QR Code Schema
export const eventSchema = z.object({
  type: z.literal("event"),
  title: z.string().min(1, "Event title is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().optional(),
});

// Union type for all QR code schemas
export const qrDataSchema = z.discriminatedUnion("type", [
  urlSchema,
  wifiSchema,
  contactSchema,
  emailSchema,
  smsSchema,
  phoneSchema,
  geoSchema,
  eventSchema,
]);

export type UrlData = z.infer<typeof urlSchema>;
export type WifiData = z.infer<typeof wifiSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type EmailData = z.infer<typeof emailSchema>;
export type SmsData = z.infer<typeof smsSchema>;
export type PhoneData = z.infer<typeof phoneSchema>;
export type GeoData = z.infer<typeof geoSchema>;
export type EventData = z.infer<typeof eventSchema>;
export type QRData = z.infer<typeof qrDataSchema>;

// QR Code display options
export interface QROptions {
  size: number;
  fgColor: string;
  bgColor: string;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

// QR Tab configuration
export interface QRTab {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const qrTabs: QRTab[] = [
  { id: "url", label: "URL/Text", icon: "link", description: "Links and plain text" },
  { id: "wifi", label: "WiFi", icon: "wifi", description: "Connect to WiFi networks" },
  { id: "contact", label: "Contact", icon: "user", description: "Share contact info (vCard)" },
  { id: "email", label: "Email", icon: "mail", description: "Compose an email" },
  { id: "sms", label: "SMS", icon: "message-square", description: "Send a text message" },
  { id: "phone", label: "Phone", icon: "phone", description: "Make a phone call" },
  { id: "geo", label: "Location", icon: "map-pin", description: "Share GPS coordinates" },
  { id: "event", label: "Event", icon: "calendar", description: "Calendar event" },
];
