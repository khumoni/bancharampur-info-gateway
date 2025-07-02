import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

// Custom analytics events for the app
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, {
        timestamp: Date.now(),
        page_url: window.location.href,
        ...parameters
      });
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

// Specific tracking functions
export const trackAIInteraction = (language: string, prompt: string) => {
  trackEvent('ai_interaction', {
    language,
    prompt_length: prompt.length,
    feature: 'chat_assistant'
  });
};

export const trackAdView = (adSlot: string, adPosition: string) => {
  trackEvent('ad_view', {
    ad_slot: adSlot,
    ad_position: adPosition,
    page_type: 'home'
  });
};

export const trackServiceAccess = (serviceName: string) => {
  trackEvent('service_access', {
    service_name: serviceName,
    access_method: 'quick_access'
  });
};

export const trackUserEngagement = (action: string, category: string) => {
  trackEvent('user_engagement', {
    action,
    category,
    engagement_time: Date.now()
  });
};

// Page view tracking
export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName,
    page_title: document.title
  });
};