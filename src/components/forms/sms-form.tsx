"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { smsSchema, SmsData } from "@/lib/qr-types";
import { MessageSquare, Phone } from "lucide-react";
import { useEffect, useRef } from "react";

interface SmsFormProps {
  onDataChange: (data: SmsData | null) => void;
}

export function SmsForm({ onDataChange }: SmsFormProps) {
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SmsData>({
    resolver: zodResolver(smsSchema),
    mode: "onChange",
    defaultValues: {
      type: "sms",
      phone: "",
      message: "",
    },
  });

  const message = watch("message");

  // Use subscription to watch form changes without causing infinite loops
  useEffect(() => {
    const subscription = watch((formData) => {
      if (formData.phone && formData.phone.length > 0) {
        onDataChangeRef.current(formData as SmsData);
      } else {
        onDataChangeRef.current(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm">Create a QR code to send an SMS</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-3 w-3" /> Phone Number *
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          placeholder="Pre-fill with a message..."
          className="min-h-[120px] resize-none"
          {...register("message")}
        />
        <p className="text-xs text-muted-foreground">
          {message?.length || 0}/160 characters
        </p>
      </div>
    </div>
  );
}
