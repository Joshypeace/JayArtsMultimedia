"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface ReCaptchaProps {
  action: string;
  onVerify: (token: string) => void;
}

export default function ReCaptcha({ action, onVerify }: ReCaptchaProps) {
  useEffect(() => {
    const loadReCaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action })
            .then((token: string) => {
              onVerify(token);
            });
        });
      }
    };

    // Load reCAPTCHA script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = loadReCaptcha;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [action, onVerify]);

  return null;
}