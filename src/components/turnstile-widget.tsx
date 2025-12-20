"use client";

import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useCallback } from "react";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export function TurnstileWidget({ onVerify, onExpire, onError }: TurnstileWidgetProps) {
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSuccess = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

  const handleExpire = useCallback(() => {
    onExpire?.();
    // Reset the widget when expired
    turnstileRef.current?.reset();
  }, [onExpire]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.error("Turnstile site key not configured");
    return null;
  }

  return (
    <div className="flex justify-center">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onExpire={handleExpire}
        onError={handleError}
        options={{
          theme: "auto",
          size: "normal",
        }}
      />
    </div>
  );
}

// Hook to reset turnstile from parent
export function useTurnstileReset() {
  const ref = useRef<TurnstileInstance>(null);
  
  const reset = useCallback(() => {
    ref.current?.reset();
  }, []);

  return { ref, reset };
}
