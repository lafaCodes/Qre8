"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wifiSchema, WifiData } from "@/lib/qr-types";
import { Wifi, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface WifiFormProps {
  onDataChange: (data: WifiData | null) => void;
}

export function WifiForm({ onDataChange }: WifiFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;
  
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WifiData>({
    resolver: zodResolver(wifiSchema),
    mode: "onChange",
    defaultValues: {
      type: "wifi",
      ssid: "",
      password: "",
      encryption: "WPA",
      hidden: false,
    },
  });

  const encryption = watch("encryption");
  const hidden = watch("hidden");

  // Use subscription to watch form changes without causing infinite loops
  useEffect(() => {
    const subscription = watch((formData) => {
      if (formData.ssid && (formData.ssid as string).length > 0) {
        onDataChangeRef.current(formData as WifiData);
      } else {
        onDataChangeRef.current(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Wifi className="h-4 w-4" />
        <span className="text-sm">Create a QR code to share WiFi access</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ssid">Network Name (SSID) *</Label>
        <Input
          id="ssid"
          placeholder="Enter WiFi network name"
          {...register("ssid")}
        />
        {errors.ssid && (
          <p className="text-sm text-destructive">{errors.ssid.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="encryption">Security Type</Label>
        <Select
          defaultValue="WPA"
          onValueChange={(value: "WPA" | "WEP" | "nopass") => setValue("encryption", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select security type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="nopass">No Password</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {encryption !== "nopass" && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter WiFi password"
              className="pl-10 pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="hidden">Hidden Network</Label>
          <p className="text-sm text-muted-foreground">
            Enable if the network is not broadcasting its SSID
          </p>
        </div>
        <Switch
          id="hidden"
          checked={hidden}
          onCheckedChange={(checked) => setValue("hidden", checked)}
        />
      </div>
    </div>
  );
}
