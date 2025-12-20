"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { urlSchema, UrlData } from "@/lib/qr-types";
import { Link2, FileText } from "lucide-react";

interface UrlFormProps {
  onDataChange: (data: UrlData | null) => void;
}

export function UrlForm({ onDataChange }: UrlFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<UrlData>({
    resolver: zodResolver(urlSchema),
    mode: "onChange",
    defaultValues: {
      type: "url",
      content: "",
    },
  });

  const content = watch("content");

  // Update parent when content changes using useEffect
  useEffect(() => {
    if (content && content.length > 0) {
      onDataChange({ type: "url", content });
    } else {
      onDataChange(null);
    }
  }, [content, onDataChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Link2 className="h-4 w-4" />
        <span className="text-sm">Enter a URL or any text content</span>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">URL or Text</Label>
        <Textarea
          id="content"
          placeholder="https://example.com or any text..."
          className="min-h-[120px] resize-none"
          {...register("content")}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileText className="h-3 w-3" />
        <span>{content?.length || 0} characters</span>
      </div>
    </div>
  );
}
