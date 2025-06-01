'use client';

import Image from 'next/image';

export default function Home() {
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
              Results
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
