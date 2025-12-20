"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, ContactData } from "@/lib/qr-types";
import { User, Building2, Phone, Mail, Globe, MapPin } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";

interface ContactFormProps {
  onDataChange: (data: ContactData | null) => void;
}

export function ContactForm({ onDataChange }: ContactFormProps) {
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      type: "contact",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      company: "",
      title: "",
      website: "",
      address: "",
    },
  });

  // Use subscription to watch form changes without causing infinite loops
  useEffect(() => {
    const subscription = watch((formData) => {
      if (formData.firstName && formData.firstName.length > 0) {
        onDataChangeRef.current(formData as ContactData);
      } else {
        onDataChangeRef.current(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <User className="h-4 w-4" />
        <span className="text-sm">Create a vCard QR code to share contact info</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="John"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...register("lastName")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-3 w-3" /> Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register("phone")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-3 w-3" /> Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2">
            <Building2 className="h-3 w-3" /> Company
          </Label>
          <Input
            id="company"
            placeholder="Acme Inc."
            {...register("company")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            placeholder="Software Engineer"
            {...register("title")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="flex items-center gap-2">
          <Globe className="h-3 w-3" /> Website
        </Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          {...register("website")}
        />
        {errors.website && (
          <p className="text-sm text-destructive">{errors.website.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="h-3 w-3" /> Address
        </Label>
        <Textarea
          id="address"
          placeholder="123 Main St, City, Country"
          className="resize-none"
          {...register("address")}
        />
      </div>
    </div>
  );
}
