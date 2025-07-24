'use client';

import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const CookieConsentBanner = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    setShowConsent(false);
    Cookies.set('cookie_consent', 'true', { expires: 365 });
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background p-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p className="text-muted-foreground text-sm">
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.
          <Link className="ml-1 underline" href="/privacy">
            Learn more
          </Link>
          .
        </p>
        <Button onClick={acceptConsent} size="sm">
          Accept
        </Button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
