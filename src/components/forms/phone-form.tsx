"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { phoneSchema, PhoneData } from "@/lib/qr-types";
import { Phone } from "lucide-react";
import { useEffect, useRef } from "react";

interface PhoneFormProps {
  onDataChange: (data: PhoneData | null) => void;
}

export function PhoneForm({ onDataChange }: PhoneFormProps) {
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PhoneData>({
    resolver: zodResolver(phoneSchema),
    mode: "onChange",
    defaultValues: {
      type: "phone",
      phone: "",
    },
  });

  // Use subscription to watch form changes without causing infinite loops
  useEffect(() => {
    const subscription = watch((formData) => {
      if (formData.phone && formData.phone.length > 0) {
        onDataChangeRef.current(formData as PhoneData);
      } else {
        onDataChangeRef.current(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Phone className="h-4 w-4" />
        <span className="text-sm">Create a QR code to initiate a phone call</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            className="pl-10"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Include country code for international numbers
      </p>
    </div>
  );
}
