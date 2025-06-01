'use client';

import Image from 'next/image';
import Script from 'next/script';
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
    <main className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Live stream iframe */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-lg p-2 md:p-4 w-full max-w-4xl">
            <iframe 
              src="https://g2.ipcamlive.com/player/player.php?alias=6839c325144d6&skin=white&autoplay=1&mute=1&disableautofullscreen=1&disablezoombutton=1&disableframecapture=1&disabletimelapseplayer=1&disablestorageplayer=1&disabledownloadbutton=1&disableplaybackspeedbutton=1&disablenavigation=1&websocketenabled=1" 
              width="800" 
              height="450" 
              className="rounded-lg w-full h-48 sm:h-64 md:h-96 lg:h-[450px]"
              style={{border: 'none'}}
              allowFullScreen
            />
            <div className="text-center text-gray-600 text-sm mt-2">
              <div className="font-bold">
                <a 
                  href="https://events.raceresult.com/presenters/?event=294902&n=Mannbrekka&k=fxubo2vVTAzh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600"
                >
                  Mannbrekka timing point
                </a>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Half Marathon (runners): 8,3 km and 17,3 km</li>
                <li>Marathon (runners): 8,3 km and 38,4 km</li>
                <li>Half Marathon (walkers): 17,3 km</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Logo and links - combined on mobile */}
        <div className="flex flex-col md:flex-col items-center gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Mobile: Logo and links on same line */}
          <div className="flex md:hidden items-center justify-center gap-4 w-full">
            <Image
              src="/tmlogo.png"
              alt="Tórshavn Marathon 2025"
              width={200}
              height={60}
              className="h-8 w-auto flex-shrink-0"
              priority
            />
            <div className="flex gap-4">
              <a 
                href="https://torshavnmarathon.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-xs transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600 whitespace-nowrap"
              >
                Website
              </a>
              <a 
                href="https://my.raceresult.com/294902/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-xs transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600 whitespace-nowrap"
              >
                Results
              </a>
              <a 
                href="https://events.raceresult.com/presenters/?event=294902&n=FM&k=83WFHlBevUqT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-xs transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600 whitespace-nowrap"
              >
                FM
              </a>
            </div>
          </div>

          {/* Desktop: Logo above, links below */}
          <div className="hidden md:flex flex-col items-center gap-6">
            <Image
              src="/tmlogo.png"
              alt="Tórshavn Marathon 2025"
              width={400}
              height={120}
              className="h-16 lg:h-20 w-auto"
              priority
            />
            <div className="flex gap-8">
              <a 
                href="https://torshavnmarathon.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600"
              >
                Official Website
              </a>
              <a 
                href="https://my.raceresult.com/294902/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600"
              >
                Live Results
              </a>
              <a 
                href="https://events.raceresult.com/presenters/?event=294902&n=FM&k=83WFHlBevUqT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600"
              >
                FM
              </a>
            </div>
          </div>
        </div>

        {/* RaceResult Live embed */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
            <div id="divRRPublish" className="RRPublish"></div>
          </div>
        </div>

        {/* Announcer link */}
        <div className="flex justify-center mt-6 md:mt-8">
          <a 
            href="https://events.raceresult.com/presenters/?event=294902&n=Announcer&k=5cajZsrb0WL3" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600"
          >
            Announcer
          </a>
        </div>

        {/* RaceResult Scripts */}
        <Script
          src="https://my.raceresult.com/RRPublish/load.js.php?lang=en"
          strategy="afterInteractive"
          onLoad={() => {
            // Initialize RRPublish after the script loads
            const globalWindow = window as unknown as {
              RRPublish?: new (element: HTMLElement, eventId: number, type: string) => {
                ShowTimerLogo: boolean;
                ShowInfoText: boolean;
              };
            };
            
            if (typeof window !== 'undefined' && globalWindow.RRPublish) {
              const element = document.getElementById("divRRPublish");
              if (element) {
                const rrp = new globalWindow.RRPublish(element, 294902, "live");
                rrp.ShowTimerLogo = false;
                rrp.ShowInfoText = false;
              }
            }
          }}
        />
      </div>
    </main>
  );
}
