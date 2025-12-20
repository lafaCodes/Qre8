"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { eventSchema, EventData } from "@/lib/qr-types";
import { Calendar, MapPin, FileText } from "lucide-react";
import { useEffect, useRef } from "react";

interface EventFormProps {
  onDataChange: (data: EventData | null) => void;
}

export function EventForm({ onDataChange }: EventFormProps) {
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EventData>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      type: "event",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  // Use subscription to watch form changes without causing infinite loops
  useEffect(() => {
    const subscription = watch((formData) => {
      if (formData.title && formData.startDate && formData.endDate) {
        onDataChangeRef.current(formData as EventData);
      } else {
        onDataChangeRef.current(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Calendar className="h-4 w-4" />
        <span className="text-sm">Create a QR code to add a calendar event</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          placeholder="Team Meeting"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-3 w-3" /> Location
        </Label>
        <Input
          id="location"
          placeholder="Conference Room A"
          {...register("location")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date & Time *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date & Time *</Label>
          <Input
            id="endDate"
            type="datetime-local"
            {...register("endDate")}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <FileText className="h-3 w-3" /> Description
        </Label>
        <Textarea
          id="description"
          placeholder="Add event details..."
          className="min-h-[80px] resize-none"
          {...register("description")}
        />
      </div>
    </div>
  );
}
