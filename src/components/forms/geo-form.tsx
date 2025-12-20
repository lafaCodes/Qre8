"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { geoSchema, GeoData } from "@/lib/qr-types";
import { MapPin, Navigation } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface GeoFormProps {
  onDataChange: (data: GeoData | null) => void;
}

export function GeoForm({ onDataChange }: GeoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;
  
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GeoData>({
    resolver: zodResolver(geoSchema),
    mode: "onChange",
    defaultValues: {
      type: "geo",
      latitude: "",
      longitude: "",
    },
  });

  // Use subscription to watch form changes without causing infinite loops
  useEffect(() => {
    const subscription = watch((formData) => {
      if (formData.latitude && formData.longitude) {
        onDataChangeRef.current(formData as GeoData);
      } else {
        onDataChangeRef.current(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude.toString());
        setValue("longitude", position.coords.longitude.toString());
        setIsLoading(false);
      },
      (error) => {
        alert("Unable to retrieve your location: " + error.message);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">Create a QR code to share a location</span>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full"
      >
        <Navigation className="h-4 w-4 mr-2" />
        {isLoading ? "Getting location..." : "Use Current Location"}
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            placeholder="40.7128"
            {...register("latitude")}
          />
          {errors.latitude && (
            <p className="text-sm text-destructive">{errors.latitude.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            placeholder="-74.0060"
            {...register("longitude")}
          />
          {errors.longitude && (
            <p className="text-sm text-destructive">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Enter coordinates in decimal format (e.g., 40.7128, -74.0060 for NYC)
      </p>
    </div>
  );
}
