"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    grecaptcha?: {
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
    // Execute reCAPTCHA
    const executeReCaptcha = () => {
      if (!window.grecaptcha) {
        console.error("reCAPTCHA not loaded");
        return;
      }
      
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        console.error("reCAPTCHA site key is missing");
        return;
      }
      
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          if (window.grecaptcha) {
            window.grecaptcha.execute(siteKey, { action })
              .then((token: string) => {
                onVerify(token);
              })
              .catch((error: Error) => {
                console.error("reCAPTCHA execution failed:", error);
              });
          }
        });
      }
    };

    // Check if reCAPTCHA script is already loaded
    if (window.grecaptcha) {
      executeReCaptcha();
      return;
    }

    // Load reCAPTCHA script
    const scriptId = "google-recaptcha-script";
    const existingScript = document.getElementById(scriptId);
    
    if (existingScript) {
      // If script already exists, wait for it to load
      const checkGrecaptcha = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkGrecaptcha);
          executeReCaptcha();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      executeReCaptcha();
    };
    
    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script");
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      if (document.getElementById(scriptId)) {
        document.body.removeChild(script);
      }
    };
  }, [action, onVerify]);

  return null;
}