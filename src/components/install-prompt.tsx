"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, Smartphone, Monitor, Share, Plus, MoreVertical, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Extend Window interface for PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

type DeviceType = "ios" | "android" | "desktop" | "unknown";
type BrowserType = "chrome" | "firefox" | "safari" | "edge" | "samsung" | "unknown";

interface DeviceInfo {
  device: DeviceType;
  browser: BrowserType;
  isStandalone: boolean;
}

function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return { device: "unknown", browser: "unknown", isStandalone: false };
  }

  const ua = navigator.userAgent.toLowerCase();
  const isStandalone = 
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone);

  // Detect device
  let device: DeviceType = "desktop";
  if (/iphone|ipad|ipod/.test(ua)) {
    device = "ios";
  } else if (/android/.test(ua)) {
    device = "android";
  }

  // Detect browser
  let browser: BrowserType = "unknown";
  if (/edg/.test(ua)) {
    browser = "edge";
  } else if (/chrome/.test(ua) && !/edg/.test(ua)) {
    browser = "chrome";
  } else if (/firefox/.test(ua)) {
    browser = "firefox";
  } else if (/safari/.test(ua) && !/chrome/.test(ua)) {
    browser = "safari";
  } else if (/samsungbrowser/.test(ua)) {
    browser = "samsung";
  }

  return { device, browser, isStandalone };
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({ device: "unknown", browser: "unknown", isStandalone: false });
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDeviceInfo(getDeviceInfo());

    // Check if already installed
    const checkInstalled = () => {
      const info = getDeviceInfo();
      setIsInstalled(info.isStandalone);
    };
    checkInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success("QRe8 installed successfully! 🎉");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      setIsOpen(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error("Install prompt error:", error);
      setIsOpen(true);
    }
  }, [deferredPrompt]);

  // Don't render if already installed or not mounted
  if (!mounted) return null;
  if (isInstalled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-green-500" disabled>
              <CheckCircle2 className="h-5 w-5" />
              <span className="sr-only">App installed</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>QRe8 is installed!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={deferredPrompt ? handleInstallClick : undefined}
                className="relative"
              >
                <Download className="h-5 w-5" />
                <span className="sr-only">Install App</span>
                {/* Pulse indicator for install availability */}
                {deferredPrompt && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                  </span>
                )}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{deferredPrompt ? "Install QRe8" : "Get the App"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Install QRe8
          </DialogTitle>
          <DialogDescription>
            Get the full app experience with offline support
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-xs text-muted-foreground">Faster</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-2xl mb-1">📴</div>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-2xl mb-1">🏠</div>
              <p className="text-xs text-muted-foreground">Home Screen</p>
            </div>
          </div>

          {/* Device-specific instructions */}
          <InstallInstructions deviceInfo={deviceInfo} onInstall={handleInstallClick} canInstall={!!deferredPrompt} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InstallInstructionsProps {
  deviceInfo: DeviceInfo;
  onInstall: () => void;
  canInstall: boolean;
}

function InstallInstructions({ deviceInfo, onInstall, canInstall }: InstallInstructionsProps) {
  const { device, browser } = deviceInfo;

  // Native install button available
  if (canInstall) {
    return (
      <div className="space-y-3">
        <Button onClick={onInstall} className="w-full" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Install Now
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Click to add QRe8 to your device
        </p>
      </div>
    );
  }

  // iOS Safari instructions
  if (device === "ios") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Smartphone className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-sm font-medium">iOS Installation</p>
        </div>
        <ol className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
            <span className="flex items-center gap-1">
              Tap the <Share className="h-4 w-4 inline text-blue-500" /> Share button
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
            <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">3</span>
            <span>Tap <strong>&quot;Add&quot;</strong> to confirm</span>
          </li>
        </ol>
        {browser !== "safari" && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded">
            💡 For the best experience, open this page in Safari
          </p>
        )}
      </div>
    );
  }

  // Android Chrome/Samsung instructions
  if (device === "android") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <Smartphone className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-sm font-medium">Android Installation</p>
        </div>
        <ol className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
            <span className="flex items-center gap-1">
              Tap the <MoreVertical className="h-4 w-4 inline" /> menu button
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
            <span className="flex items-center gap-1">
              Tap <Plus className="h-4 w-4 inline" /> <strong>&quot;Add to Home screen&quot;</strong> or <strong>&quot;Install app&quot;</strong>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">3</span>
            <span>Tap <strong>&quot;Install&quot;</strong> to confirm</span>
          </li>
        </ol>
      </div>
    );
  }

  // Desktop instructions
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <Monitor className="h-5 w-5 text-purple-500 shrink-0" />
        <p className="text-sm font-medium">Desktop Installation</p>
      </div>
      
      {browser === "chrome" || browser === "edge" ? (
        <ol className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
            <span>Look for the <Download className="h-4 w-4 inline" /> install icon in the address bar</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
            <span>Click <strong>&quot;Install&quot;</strong> in the popup</span>
          </li>
        </ol>
      ) : browser === "firefox" ? (
        <p className="text-sm text-muted-foreground">
          Firefox doesn&apos;t support PWA installation on desktop. Try using Chrome or Edge for the best experience.
        </p>
      ) : (
        <ol className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">1</span>
            <span>Open the browser menu</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">2</span>
            <span>Look for <strong>&quot;Install&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong></span>
          </li>
        </ol>
      )}

      <p className="text-xs text-muted-foreground text-center">
        QRe8 works great in your browser too!
      </p>
    </div>
  );
}

/**
 * Legacy component for layout.tsx - functionality moved to InstallButton in header
 * This is kept for backward compatibility but renders nothing
 */
export function InstallPrompt() {
  // Install functionality is now in the header InstallButton
  // This component is kept for backward compatibility
  return null;
}
