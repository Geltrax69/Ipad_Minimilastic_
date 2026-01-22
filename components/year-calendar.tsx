'use client';

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function YearCalendar() {
  const [days, setDays] = useState<Array<{ date: Date; status: 'passed' | 'today' | 'future' }>>([]);
  const [stats, setStats] = useState({ passed: 0, dayPercentage: 0, daysLeft: 0 });
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // iPad 11" dimensions: 1668x2560 (portrait) or 2560x1668 (landscape)
  const IPAD_11_WIDTH = 1668;
  const IPAD_11_HEIGHT = 2560;

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeapYear ? 366 : 365;

    const daysArray = [];
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, 0, i);
      let status: 'passed' | 'today' | 'future' = 'future';

      if (date < today) {
        status = 'passed';
      } else if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        status = 'today';
      }

      daysArray.push({ date, status });
    }

    const passedDays = daysArray.filter(d => d.status === 'passed').length;
    const dayPercentage = Math.round((passedDays / totalDays) * 100);
    const daysLeft = totalDays - passedDays - 1;

    setDays(daysArray);
    setStats({ passed: passedDays, dayPercentage, daysLeft });

    // Generate shareable URL from GitHub Pages
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const url = `${baseUrl}/days?height=${IPAD_11_HEIGHT}&width=${IPAD_11_WIDTH}`;
    setShareUrl(url);
  }, []);

  const handleCopyUrl = async () => {
    if (!shareUrl) return;

    try {
      // Try using the modern Clipboard API
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback: use the older approach with a temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopied(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-2xl">
        {/* iPad Mockup */}
        <div className="rounded-3xl bg-black shadow-2xl p-3 border border-gray-800">
          {/* iPad Screen */}
          <div className="bg-background rounded-2xl p-6 flex flex-col items-center justify-start min-h-[600px] space-y-4">
            {/* Status Bar */}
            <div className="w-full flex justify-between items-center text-xs text-muted-foreground px-2">
              <span>WOO</span>
              <span className="flex gap-1">📶 📡 🔋</span>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col items-center gap-1 mt-4">
              <p className="text-sm text-muted-foreground">
                {days.find(d => d.status === 'today')?.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-5xl font-bold text-primary tracking-tight">
                {String(new Date().getHours()).padStart(2, '0')}:{String(new Date().getMinutes()).padStart(2, '0')}
              </p>
            </div>

            {/* Calendar Grid */}
            <div className="mt-6 mb-4">
              <div className="grid-cols-13 gap-1.5">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      day.status === 'passed'
                        ? 'bg-white'
                        : day.status === 'today'
                          ? 'bg-accent scale-125 ring-2 ring-accent ring-offset-1 ring-offset-background'
                          : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress Section */}
            <div className="w-full mt-6 space-y-4">
              {/* Day Percentage Bar */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-600 transition-all duration-500"
                    style={{ width: `${stats.dayPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{stats.dayPercentage}%</span>
              </div>

              {/* Days Left */}
              <div className="pt-2 border-t border-gray-700">
                <p className="text-center text-orange-500 text-sm font-medium">{stats.daysLeft} days left</p>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="flex justify-center mt-3">
            <div className="w-32 h-1 bg-black rounded-full" />
          </div>
        </div>

        {/* Year Display */}
        <div className="text-center mt-8">
          <h2 className="text-4xl font-bold text-primary mb-2">Year Calendar</h2>
          <p className="text-muted-foreground text-lg mb-6">Track the {new Date().getFullYear()} year's progress</p>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleCopyUrl}
              className="px-8 py-3 border border-muted rounded-lg text-primary hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Install for iPad 11"
                </>
              )}
            </button>
            {shareUrl && (
              <p className="text-xs text-muted-foreground text-center max-w-md break-all">
                {shareUrl}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
