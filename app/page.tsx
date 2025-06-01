'use client';

import Image from 'next/image';
import Script from 'next/script';

export default function Home() {
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
              <div className="font-bold">Mannbrekka timing point</div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Half Marathon (runners): 8,3 km and 20,4 km</li>
                <li>Marathon (runners): 8,3 km and 38,4 km</li>
                <li>Half Marathon (walkers): 17 km</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Logo - Always below iframe */}
        <div className="flex justify-center mb-6 md:mb-8">
          <Image
            src="/tmlogo.png"
            alt="Tórshavn Marathon 2025"
            width={400}
            height={120}
            className="h-12 md:h-16 lg:h-20 w-auto"
            priority
          />
        </div>

        {/* Subtle links */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-6 md:mb-8">
          <a 
            href="https://torshavnmarathon.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600 text-center sm:text-left"
          >
            Official Website
          </a>
          <a 
            href="https://my.raceresult.com/294902/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 underline decoration-gray-400 hover:decoration-gray-600 text-center sm:text-left"
          >
            Live Results
          </a>
        </div>

        {/* RaceResult Live embed */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
            <div id="divRRPublish" className="RRPublish"></div>
          </div>
        </div>

        {/* RaceResult Scripts */}
        <Script
          src="https://my.raceresult.com/RRPublish/load.js.php?lang=en"
          strategy="afterInteractive"
          onLoad={() => {
            // Initialize RRPublish after the script loads
            if (typeof window !== 'undefined' && (window as any).RRPublish) {
              const rrp = new (window as any).RRPublish(document.getElementById("divRRPublish"), 294902, "live");
              rrp.ShowTimerLogo = false;
              rrp.ShowInfoText = false;
            }
          }}
        />
      </div>
    </main>
  );
}
