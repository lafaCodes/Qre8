"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emailSchema, EmailData } from "@/lib/qr-types";
import { Mail, AtSign } from "lucide-react";
import { useEffect, useRef } from "react";

interface EmailFormProps {
  onDataChange: (data: EmailData | null) => void;
}

export function EmailForm({ onDataChange }: EmailFormProps) {
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: {
      type: "email",
      email: "",
      subject: "",
      body: "",
    },
  });

  // Use subscription to watch form changes without causing infinite loops
  useEffect(() => {
    const subscription = watch((formData) => {
      // Basic email validation check
      const emailValue = formData.email as string;
      const isValidEmail = emailValue && emailValue.length > 0 && emailValue.includes("@");
      if (isValidEmail) {
        onDataChangeRef.current(formData as EmailData);
      } else {
        onDataChangeRef.current(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Mail className="h-4 w-4" />
        <span className="text-sm">Create a QR code to compose an email</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <AtSign className="h-3 w-3" /> Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="recipient@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Email subject line"
          {...register("subject")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Message Body</Label>
        <Textarea
          id="body"
          placeholder="Write your message here..."
          className="min-h-[120px] resize-none"
          {...register("body")}
        />
      </div>
    </div>
  );
}
