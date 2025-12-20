"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRData, qrTabs } from "@/lib/qr-types";
import { QRDisplay } from "@/components/qr-display";
import { ThemeToggle } from "@/components/theme-toggle";
import { TurnstileWidget } from "@/components/turnstile-widget";
import QRCode from "qrcode";
import {
  UrlForm,
  WifiForm,
  ContactForm,
  EmailForm,
  SmsForm,
  PhoneForm,
  GeoForm,
  EventForm,
} from "@/components/forms";
import {
  Link2,
  Wifi,
  User,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const iconMap: Record<string, React.ReactNode> = {
  link: <Link2 className="h-4 w-4" />,
  wifi: <Wifi className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  mail: <Mail className="h-4 w-4" />,
  "message-square": <MessageSquare className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  "map-pin": <MapPin className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
};

export function QRGenerator() {
  const [activeTab, setActiveTab] = useState("url");
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [logoQrSvgLight, setLogoQrSvgLight] = useState<string>("");
  const [logoQrSvgDark, setLogoQrSvgDark] = useState<string>("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Turnstile verification state
  const [isVerified, setIsVerified] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate the logo QR codes for both themes on mount
  useEffect(() => {
    const generateLogoQR = async () => {
      try {
        // White QR for light mode (dark bg-primary container)
        const lightSvg = await QRCode.toString("https://qre8.changa.tech", {
          type: "svg",
          margin: 0,
          errorCorrectionLevel: "L",
          color: {
            dark: "#ffffff",
            light: "#00000000",
          },
        });
        setLogoQrSvgLight(lightSvg);

        // Black QR for dark mode (light bg-primary container)
        const darkSvg = await QRCode.toString("https://qre8.changa.tech", {
          type: "svg",
          margin: 0,
          errorCorrectionLevel: "L",
          color: {
            dark: "#000000",
            light: "#00000000",
          },
        });
        setLogoQrSvgDark(darkSvg);
      } catch (err) {
        console.error("Error generating logo QR:", err);
      }
    };
    generateLogoQR();
  }, []);

  // Get the appropriate QR code based on current theme
  const logoQrSvg = mounted ? (resolvedTheme === "dark" ? logoQrSvgDark : logoQrSvgLight) : logoQrSvgLight;

  // Handle Turnstile verification (client-side for static export)
  // The Turnstile widget itself provides bot protection
  const handleTurnstileVerify = useCallback((token: string) => {
    // Token received means the challenge was passed
    // For a QR code generator, client-side verification is sufficient
    if (token) {
      setIsVerified(true);
      toast.success("Verified! You can now generate QR codes.");
    }
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    // Token expired, but don't reset verification state
    // The user can continue using the app
  }, []);

  const handleTurnstileError = useCallback(() => {
    toast.error("Verification widget error. Please refresh the page.");
  }, []);

  const handleDataChange = useCallback((data: QRData | null) => {
    setQrData(data);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setQrData(null);
  };

  const renderForm = () => {
    switch (activeTab) {
      case "url":
        return <UrlForm onDataChange={handleDataChange} />;
      case "wifi":
        return <WifiForm onDataChange={handleDataChange} />;
      case "contact":
        return <ContactForm onDataChange={handleDataChange} />;
      case "email":
        return <EmailForm onDataChange={handleDataChange} />;
      case "sms":
        return <SmsForm onDataChange={handleDataChange} />;
      case "phone":
        return <PhoneForm onDataChange={handleDataChange} />;
      case "geo":
        return <GeoForm onDataChange={handleDataChange} />;
      case "event":
        return <EventForm onDataChange={handleDataChange} />;
      default:
        return null;
    }
  };

  // Verification gate component
  const VerificationGate = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <ShieldCheck className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Quick Verification</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Please complete a quick verification to start generating QR codes.
          This helps us prevent abuse.
        </p>
      </div>
      <TurnstileWidget
        onVerify={handleTurnstileVerify}
        onExpire={handleTurnstileExpire}
        onError={handleTurnstileError}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-primary text-primary-foreground">
                {logoQrSvg ? (
                  <div
                    className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: logoQrSvg }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-foreground/20 rounded animate-pulse" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  <span className="text-primary">QR</span>e8
                </h1>
                <p className="text-xs text-muted-foreground">by CHANGA.tech</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              <span className="text-primary">QR</span>e8 Beautiful QR Codes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-2">
              Generate QR codes for URLs, WiFi networks, contacts, and more.
              Free, fast, and works offline.
            </p>
            <p className="text-sm text-muted-foreground/70">
              QRe8 = QR + Cr<span className="font-semibold">8</span> (Create) — say it out loud! 🎤
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="order-2 lg:order-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Select QR Type</CardTitle>
                <CardDescription>
                  Choose what kind of QR code you want to create
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isVerified ? (
                  <VerificationGate />
                ) : (
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid grid-cols-4 lg:grid-cols-4 h-auto gap-1 p-1 mb-6">
                      {qrTabs.slice(0, 4).map((tab) => (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex flex-col gap-1 py-2 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {iconMap[tab.icon]}
                          <span className="text-xs">{tab.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsList className="grid grid-cols-4 lg:grid-cols-4 h-auto gap-1 p-1 mb-6">
                      {qrTabs.slice(4).map((tab) => (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex flex-col gap-1 py-2 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {iconMap[tab.icon]}
                          <span className="text-xs">{tab.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <div className="min-h-[300px]">{renderForm()}</div>
                  </Tabs>
                )}
              </CardContent>
            </Card>

            {/* QR Display Section */}
            <Card className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Preview & Download</CardTitle>
                <CardDescription>
                  Your QR code will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRDisplay data={qrData} />
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "⚡", title: "Instant Generation", desc: "Real-time QR code preview" },
              { icon: "🎨", title: "Customizable", desc: "Colors, size & error correction" },
              { icon: "📱", title: "PWA Ready", desc: "Works offline on any device" },
              { icon: "🔒", title: "Privacy First", desc: "All processing happens locally" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-4 rounded-xl border bg-card text-center"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Maintained by{" "}
              <a
                href="https://lafa.codes"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                lafa.codes
              </a>
              {" "}(
              <a
                href="https://changa.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                CHANGA.tech
              </a>
              )
            </p>
            <a
              href="https://www.buymeacoffee.com/changa.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              title="Buy me a coffee"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                alt="Buy Me A Coffee"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
