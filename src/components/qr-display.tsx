"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QROptions, QRData, qrTabs } from "@/lib/qr-types";
import { generateQRString } from "@/lib/qr-generator";
import { Download, Copy, Check, Settings2, Palette } from "lucide-react";
import { toast } from "sonner";

interface QRDisplayProps {
  data: QRData | null;
}

const defaultOptions: QROptions = {
  size: 256,
  fgColor: "#000000",
  bgColor: "#ffffff",
  errorCorrectionLevel: "M",
};

// Helper to get QR type label
const getQRTypeLabel = (type: string): string => {
  const tab = qrTabs.find((t) => t.id === type);
  return tab?.label || type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper to format date
const formatDate = (): string => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function QRDisplay({ data }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const printCanvasRef = useRef<HTMLCanvasElement>(null);
  const [options, setOptions] = useState<QROptions>(defaultOptions);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const generateQR = useCallback(async () => {
    if (!data) return;

    const qrString = generateQRString(data);
    
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, qrString, {
          width: options.size,
          margin: 2,
          color: {
            dark: options.fgColor,
            light: options.bgColor,
          },
          errorCorrectionLevel: options.errorCorrectionLevel,
        });
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  }, [data, options]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const waitForPaint = () => new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });

  const downloadPNG = async () => {
    if (!printContainerRef.current || !printCanvasRef.current || !data) return;

    const container = printContainerRef.current;
    const canvas = printCanvasRef.current;
    const originalClipPath = container.style.clipPath;

    try {
      container.style.clipPath = "none";
      await waitForPaint();
      
      const qrString = generateQRString(data);
      await QRCode.toCanvas(canvas, qrString, {
        width: 280,
        margin: 0,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
      
      await waitForPaint();
      
      const dataUrl = await toPng(container, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        skipFonts: true,
      });
      
      container.style.clipPath = originalClipPath;
      
      const link = document.createElement("a");
      const typeLabel = getQRTypeLabel(data.type).toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.download = "qre8-" + typeLabel + "-" + Date.now() + ".png";
      link.href = dataUrl;
      link.click();
      toast.success("QR code downloaded as PNG!");
    } catch (error) {
      container.style.clipPath = originalClipPath;
      console.error("Error downloading PNG:", error);
      toast.error("Failed to download PNG");
    }
  };

  const downloadSVG = async () => {
    if (!data) return;

    try {
      const qrString = generateQRString(data);
      const svgString = await QRCode.toString(qrString, {
        type: "svg",
        width: options.size,
        margin: 2,
        color: {
          dark: options.fgColor,
          light: options.bgColor,
        },
        errorCorrectionLevel: options.errorCorrectionLevel,
      });

      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "qr-code-" + Date.now() + ".svg";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded as SVG!");
    } catch (error) {
      console.error("Error downloading SVG:", error);
      toast.error("Failed to download SVG");
    }
  };

  const copyToClipboard = async () => {
    if (!printContainerRef.current || !printCanvasRef.current || !data) return;

    const container = printContainerRef.current;
    const canvas = printCanvasRef.current;
    const originalClipPath = container.style.clipPath;
    let dataUrl: string | null = null;

    try {
      container.style.clipPath = "none";
      await waitForPaint();
      
      const qrString = generateQRString(data);
      await QRCode.toCanvas(canvas, qrString, {
        width: 280,
        margin: 0,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: options.errorCorrectionLevel,
      });
      
      await waitForPaint();
      
      dataUrl = await toPng(container, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        skipFonts: true,
      });
      
      container.style.clipPath = originalClipPath;

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (!navigator.clipboard || !navigator.clipboard.write) {
        const link = document.createElement("a");
        const typeLabel = getQRTypeLabel(data.type).toLowerCase().replace(/[^a-z0-9]/g, "-");
        link.download = "qre8-" + typeLabel + "-" + Date.now() + ".png";
        link.href = dataUrl;
        link.click();
        toast.success("Clipboard not available - image downloaded instead");
        return;
      }

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      container.style.clipPath = originalClipPath;
      
      if (error instanceof Error && error.name === "NotAllowedError" && dataUrl) {
        const link = document.createElement("a");
        const typeLabel = getQRTypeLabel(data.type).toLowerCase().replace(/[^a-z0-9]/g, "-");
        link.download = "qre8-" + typeLabel + "-" + Date.now() + ".png";
        link.href = dataUrl;
        link.click();
        toast.success("Image downloaded (clipboard requires user interaction)");
      } else {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 border-2 border-dashed rounded-xl bg-muted/20">
        <div className="w-32 h-32 bg-muted rounded-xl flex items-center justify-center mb-4">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-muted-foreground/30 rounded-sm"
              />
            ))}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground">
          Your QR Code Preview
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the form to generate your QR code
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden Print Container */}
      <div
        ref={printContainerRef}
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          width: "400px",
          height: "520px",
          backgroundColor: "#ffffff",
          padding: "32px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          zIndex: -9999,
          pointerEvents: "none",
          clipPath: "inset(100%)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
            {getQRTypeLabel(data.type)} QR Code
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "16px", backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <canvas ref={printCanvasRef} />
        </div>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: "40px", height: "40px", borderRadius: "8px" }}>
              <rect width="512" height="512" rx="96" fill="#0f172a"/>
              <g transform="translate(56, 56) scale(16)">
                <path stroke="#ffffff" strokeWidth="1" d="M0 0.5h7m1 0h2m6 0h1m1 0h7M0 1.5h1m5 0h1m6 0h1m4 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m1 0h1m2 0h5m2 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h2m3 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h4m2 0h3m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m2 0h1m2 0h2m4 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 7.5h1m1 0h1M0 8.5h4m2 0h1m1 0h1m7 0h2m2 0h3m1 0h1M2 9.5h1m1 0h1m2 0h3m3 0h1m2 0h2m1 0h1m3 0h1M6 10.5h1m6 0h1m3 0h1m1 0h2M1 11.5h1m1 0h1m1 0h1m1 0h2m2 0h3m2 0h1m1 0h2m1 0h2M4 12.5h3m1 0h2m1 0h1m1 0h2m2 0h4m1 0h3M1 13.5h4m3 0h1m1 0h2m3 0h6m3 0h1M1 14.5h3m1 0h6m1 0h3m2 0h1m2 0h1m1 0h2M0 15.5h1m6 0h2m1 0h1m1 0h1m4 0h4m3 0h1M2 16.5h7m2 0h1m1 0h1m2 0h9M8 17.5h1m1 0h1m1 0h2m2 0h1m3 0h1m1 0h1m1 0h1M0 18.5h7m4 0h2m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M0 19.5h1m5 0h1m5 0h1m2 0h2m3 0h1m2 0h1M0 20.5h1m1 0h3m1 0h1m3 0h2m2 0h1m1 0h6m2 0h1M0 21.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m2 0h2m1 0h1m1 0h5M0 22.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h4m1 0h1m1 0h1m1 0h2M0 23.5h1m5 0h1m1 0h1m1 0h1m2 0h2m3 0h1m1 0h1m1 0h1M0 24.5h7m1 0h1m2 0h5m2 0h7"/>
              </g>
            </svg>
            <div>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0", letterSpacing: "-0.3px" }}>QRe8</p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>by CHANGA.tech</p>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "10px", color: "#94a3b8", margin: "0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Created</p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0", fontWeight: 500 }}>{formatDate()}</p>
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center">
        <div
          ref={containerRef}
          className="p-6 bg-white rounded-2xl shadow-lg"
          style={{ backgroundColor: options.bgColor }}
        >
          <canvas ref={canvasRef} className="block" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={downloadPNG} className="gap-2">
          <Download className="h-4 w-4" />
          Download PNG
        </Button>
        <Button onClick={downloadSVG} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download SVG
        </Button>
        <Button onClick={copyToClipboard} variant="outline" className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Customization Options */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="font-medium">Customize QR Code</span>
          </div>
          <Palette className="h-4 w-4 text-muted-foreground" />
        </button>

        {showOptions && (
          <div className="p-4 border-t space-y-4 bg-muted/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Size</Label>
                <span className="text-sm text-muted-foreground">{options.size}px</span>
              </div>
              <Slider
                value={[options.size]}
                min={128}
                max={512}
                step={32}
                onValueChange={([value]) => setOptions((prev: QROptions) => ({ ...prev, size: value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fgColor">Foreground</Label>
                <div className="flex gap-2">
                  <Input
                    id="fgColor"
                    type="color"
                    value={options.fgColor}
                    onChange={(e) => setOptions((prev: QROptions) => ({ ...prev, fgColor: e.target.value }))}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={options.fgColor}
                    onChange={(e) => setOptions((prev: QROptions) => ({ ...prev, fgColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bgColor">Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={options.bgColor}
                    onChange={(e) => setOptions((prev: QROptions) => ({ ...prev, bgColor: e.target.value }))}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={options.bgColor}
                    onChange={(e) => setOptions((prev: QROptions) => ({ ...prev, bgColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Error Correction</Label>
              <Select
                value={options.errorCorrectionLevel}
                onValueChange={(value: "L" | "M" | "Q" | "H") =>
                  setOptions((prev: QROptions) => ({ ...prev, errorCorrectionLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Higher error correction allows more damage to the QR code while remaining scannable
              </p>
            </div>

            <Button variant="ghost" className="w-full" onClick={() => setOptions(defaultOptions)}>
              Reset to Default
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
