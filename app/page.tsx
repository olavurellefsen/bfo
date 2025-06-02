'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

// Generate a unique session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// Visitor data interface
interface VisitorData {
  sessionId: string;
  timestamp: string;
  url: string;
  referrer: string;
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: { width: number; height: number } | null;
  viewportSize: { width: number; height: number } | null;
  platform: string;
  cookieEnabled: boolean;
  onlineStatus: boolean;
  localTime: string;
  utcOffset: number;
  eventType: 'page_visit' | 'heartbeat';
}

// Get visitor details
const getVisitorDetails = (sessionId: string) => {
  const now = new Date();
  
  return {
    sessionId,
    timestamp: now.toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof window !== 'undefined' ? document.referrer : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    language: typeof navigator !== 'undefined' ? navigator.language : '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: typeof window !== 'undefined' ? {
      width: window.screen.width,
      height: window.screen.height
    } : null,
    viewportSize: typeof window !== 'undefined' ? {
      width: window.innerWidth,
      height: window.innerHeight
    } : null,
    platform: typeof navigator !== 'undefined' ? navigator.platform : '',
    cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
    onlineStatus: typeof navigator !== 'undefined' ? navigator.onLine : true,
    localTime: now.toLocaleString(),
    utcOffset: now.getTimezoneOffset()
  };
};

// Send tracking data to Flowcore webhook
const sendTrackingData = async (data: VisitorData) => {
  try {
    const response = await fetch('https://webhook.api.flowcore.io/event/bragdid/d7e28b3a-2c7b-44ff-ad54-01d0df856b24/bfo.2025/visitor.0?key=5595588b-5d94-4c8c-80cd-8d334b2f4899', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.warn('Failed to send tracking data:', response.status);
    }
  } catch (error) {
    console.warn('Error sending tracking data:', error);
  }
};

// Handle link click tracking
const handleLinkClick = (linkName: string, url: string, sessionId: string) => {
  const clickData = getVisitorDetails(sessionId);
  sendTrackingData({ 
    ...clickData, 
    eventType: 'page_visit', // Using page_visit type but could be extended to 'link_click'
    url: `click:${linkName}:${url}` // Modified URL to indicate this is a click event
  });
};

export default function Home() {
  const sessionIdRef = useRef<string | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Generate session ID on mount
    sessionIdRef.current = generateSessionId();
    
    // Send initial tracking data
    const initialData = getVisitorDetails(sessionIdRef.current);
    sendTrackingData({ ...initialData, eventType: 'page_visit' });
    
    // Set up interval to send data every 30 seconds
    intervalRef.current = window.setInterval(() => {
      if (sessionIdRef.current) {
        const heartbeatData = getVisitorDetails(sessionIdRef.current);
        sendTrackingData({ ...heartbeatData, eventType: 'heartbeat' });
      }
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current !== undefined) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        {/* Logo and navigation */}
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <Image
            src="/tmlogo.png"
            alt="Tórshavn Marathon 2025"
            width={400}
            height={120}
            className="h-16 lg:h-20 w-auto"
            priority
          />
          
          {/* Navigation links */}
          <div className="flex gap-8">
            <a 
              href="https://torshavnmarathon.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => sessionIdRef.current && handleLinkClick('Official Website', 'https://torshavnmarathon.com/', sessionIdRef.current)}
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600"
            >
              Official Website
            </a>
            <a 
              href="https://my.raceresult.com/294902/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => sessionIdRef.current && handleLinkClick('Results', 'https://my.raceresult.com/294902/', sessionIdRef.current)}
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600"
            >
              Results
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
