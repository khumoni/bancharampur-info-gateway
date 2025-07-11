import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSenseComponent: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  responsive = true,
  className = '',
  style = {}
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Skip AdSense loading in development or if no valid publisher ID
    if (process.env.NODE_ENV === 'development') {
      console.log('AdSense skipped in development mode');
      return;
    }

    // Load Google AdSense script only with valid publisher ID
    const publisherId = 'ca-pub-YOUR_PUBLISHER_ID'; // Replace with actual ID
    if (publisherId === 'ca-pub-YOUR_PUBLISHER_ID') {
      console.log('AdSense placeholder ID detected, skipping load');
      return;
    }

    if (!document.querySelector('script[src*="adsbygoogle"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      document.head.appendChild(script);
    }

    // Initialize ad after component mounts
    const timeoutId = setTimeout(() => {
      try {
        if (!isLoaded.current && window.adsbygoogle) {
          window.adsbygoogle.push({});
          isLoaded.current = true;
        }
      } catch (error) {
        console.warn('AdSense initialization error:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Show placeholder in development or with invalid publisher ID
  if (process.env.NODE_ENV === 'development' || adSlot.includes('1234567')) {
    return (
      <div className={`adsense-placeholder ${className} bg-muted/20 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center`} style={style}>
        <div className="text-muted-foreground text-sm text-center p-4">
          <div>Ad Placeholder</div>
          <div className="text-xs mt-1">AdSense will appear here in production</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          ...style
        }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

// Specialized ad components for different placements
export const HeaderBannerAd: React.FC = () => (
  <AdSenseComponent
    adSlot="1234567890"
    adFormat="horizontal"
    className="my-4"
    style={{ minHeight: '90px' }}
  />
);

export const SidebarAd: React.FC = () => (
  <AdSenseComponent
    adSlot="1234567891"
    adFormat="rectangle"
    className="hidden lg:block sticky top-4"
    style={{ width: '300px', height: '250px' }}
  />
);

export const InFeedAd: React.FC<{ index: number }> = ({ index }) => (
  <AdSenseComponent
    adSlot="1234567892"
    adFormat="auto"
    className="my-6 border border-border rounded-lg p-4 bg-muted/30"
    style={{ minHeight: '200px' }}
  />
);

export const FooterAd: React.FC = () => (
  <AdSenseComponent
    adSlot="1234567893"
    adFormat="horizontal"
    className="mt-8"
    style={{ minHeight: '100px' }}
  />
);