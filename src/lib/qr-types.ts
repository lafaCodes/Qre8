import { z } from "zod";

// Security: Maximum lengths to prevent DoS attacks
// QR codes have a max capacity of ~4,296 alphanumeric characters
const MAX_URL_LENGTH = 2048;
const MAX_TEXT_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_PHONE_LENGTH = 20;
const MAX_EMAIL_LENGTH = 254; // RFC 5321

// Phone number regex - allows +, digits, spaces, dashes, parentheses
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

// Latitude regex - valid range: -90 to 90
const latitudeRegex = /^-?([0-8]?[0-9](\.[0-9]{1,8})?|90(\.0{1,8})?)$/;

// Longitude regex - valid range: -180 to 180
const longitudeRegex = /^-?((1[0-7][0-9]|[0-9]{1,2})(\.[0-9]{1,8})?|180(\.0{1,8})?)$/;

// URL/Text QR Code Schema
export const urlSchema = z.object({
  type: z.literal("url"),
  content: z.string()
    .min(1, "Content is required")
    .max(MAX_URL_LENGTH, `Content must be ${MAX_URL_LENGTH} characters or less`),
});

// WiFi QR Code Schema
export const wifiSchema = z.object({
  type: z.literal("wifi"),
  ssid: z.string()
    .min(1, "Network name is required")
    .max(32, "Network name must be 32 characters or less"), // WiFi SSID limit
  password: z.string()
    .max(63, "Password must be 63 characters or less") // WPA2 limit
    .optional(),
  encryption: z.enum(["WPA", "WEP", "nopass"]),
  hidden: z.boolean(),
});

// Contact (vCard) QR Code Schema
export const contactSchema = z.object({
  type: z.literal("contact"),
  firstName: z.string()
    .min(1, "First name is required")
    .max(MAX_TEXT_LENGTH, `First name must be ${MAX_TEXT_LENGTH} characters or less`),
  lastName: z.string()
    .max(MAX_TEXT_LENGTH, `Last name must be ${MAX_TEXT_LENGTH} characters or less`)
    .optional(),
  phone: z.string()
    .max(MAX_PHONE_LENGTH, `Phone must be ${MAX_PHONE_LENGTH} characters or less`)
    .refine((val) => !val || phoneRegex.test(val), "Invalid phone number format")
    .optional(),
  email: z.string()
    .max(MAX_EMAIL_LENGTH, `Email must be ${MAX_EMAIL_LENGTH} characters or less`)
    .email()
    .optional()
    .or(z.literal("")),
  company: z.string()
    .max(MAX_TEXT_LENGTH, `Company must be ${MAX_TEXT_LENGTH} characters or less`)
    .optional(),
  title: z.string()
    .max(MAX_TEXT_LENGTH, `Title must be ${MAX_TEXT_LENGTH} characters or less`)
    .optional(),
  website: z.string()
    .max(MAX_URL_LENGTH, `Website must be ${MAX_URL_LENGTH} characters or less`)
    .url()
    .optional()
    .or(z.literal("")),
  address: z.string()
    .max(MAX_TEXT_LENGTH, `Address must be ${MAX_TEXT_LENGTH} characters or less`)
    .optional(),
});

// Email QR Code Schema
export const emailSchema = z.object({
  type: z.literal("email"),
  email: z.string()
    .max(MAX_EMAIL_LENGTH, `Email must be ${MAX_EMAIL_LENGTH} characters or less`)
    .email("Valid email is required"),
  subject: z.string()
    .max(MAX_TEXT_LENGTH, `Subject must be ${MAX_TEXT_LENGTH} characters or less`)
    .optional(),
  body: z.string()
    .max(MAX_DESCRIPTION_LENGTH, `Body must be ${MAX_DESCRIPTION_LENGTH} characters or less`)
    .optional(),
});

// SMS QR Code Schema
export const smsSchema = z.object({
  type: z.literal("sms"),
  phone: z.string()
    .min(1, "Phone number is required")
    .max(MAX_PHONE_LENGTH, `Phone must be ${MAX_PHONE_LENGTH} characters or less`)
    .regex(phoneRegex, "Invalid phone number format"),
  message: z.string()
    .max(160, "SMS message must be 160 characters or less") // Standard SMS limit
    .optional(),
});

// Phone Call QR Code Schema
export const phoneSchema = z.object({
  type: z.literal("phone"),
  phone: z.string()
    .min(1, "Phone number is required")
    .max(MAX_PHONE_LENGTH, `Phone must be ${MAX_PHONE_LENGTH} characters or less`)
    .regex(phoneRegex, "Invalid phone number format"),
});

// Geo Location QR Code Schema
export const geoSchema = z.object({
  type: z.literal("geo"),
  latitude: z.string()
    .min(1, "Latitude is required")
    .regex(latitudeRegex, "Latitude must be between -90 and 90"),
  longitude: z.string()
    .min(1, "Longitude is required")
    .regex(longitudeRegex, "Longitude must be between -180 and 180"),
});

// Event (Calendar) QR Code Schema
export const eventSchema = z.object({
  type: z.literal("event"),
  title: z.string()
    .min(1, "Event title is required")
    .max(MAX_TEXT_LENGTH, `Title must be ${MAX_TEXT_LENGTH} characters or less`),
  location: z.string()
    .max(MAX_TEXT_LENGTH, `Location must be ${MAX_TEXT_LENGTH} characters or less`)
    .optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`)
    .optional(),
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
