'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

interface DayWithMark {
  date: Date;
  status: 'passed' | 'today' | 'future';
  isNewToday?: boolean;
}

export default function DaysPage() {
  const searchParams = useSearchParams();
  const height = searchParams.get('height') || '2560';
  const width = searchParams.get('width') || '1668';
  
  const [days, setDays] = useState<DayWithMark[]>([]);
  const [stats, setStats] = useState({ passed: 0, dayPercentage: 0, daysLeft: 0 });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const updateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeapYear ? 366 : 365;

    const daysArray: DayWithMark[] = [];
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, 0, i);
      let status: 'passed' | 'today' | 'future' = 'future';
      let isNewToday = false;

      if (date < today) {
        status = 'passed';
        // Mark as new if it was yesterday and is now passed (new dot from midnight)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (
          date.getDate() === yesterday.getDate() &&
          date.getMonth() === yesterday.getMonth() &&
          date.getFullYear() === yesterday.getFullYear()
        ) {
          isNewToday = true;
        }
      } else if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        status = 'today';
      }

      daysArray.push({ date, status, isNewToday });
    }

    const passedDays = daysArray.filter(d => d.status === 'passed').length;
    const dayPercentage = Math.round((passedDays / totalDays) * 100);
    const daysLeft = totalDays - passedDays - 1;

    setDays(daysArray);
    setStats({ passed: passedDays, dayPercentage, daysLeft });
    setLastUpdate(today);
  };

  useEffect(() => {
    updateCalendar();

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Set up interval to update at midnight
    const midnightTimer = setTimeout(() => {
      updateCalendar();
      // Then update every 24 hours
      const dailyInterval = setInterval(updateCalendar, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div 
        className="bg-background flex items-center justify-center p-4"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
          {/* Calendar Grid */}
          <div>
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full transition-all ${
                    day.status === 'passed'
                      ? day.isNewToday 
                        ? 'bg-white animate-pulse'
                        : 'bg-white'
                      : day.status === 'today'
                        ? 'bg-orange-500 scale-150 ring-2 ring-orange-400 ring-offset-2 ring-offset-background'
                        : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="w-full max-w-lg space-y-4">
            {/* Day Percentage Bar */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-600 transition-all duration-500"
                  style={{ width: `${stats.dayPercentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">{stats.dayPercentage}%</span>
            </div>

            {/* Days Left */}
            <div className="pt-2 border-t border-gray-700">
              <p className="text-center text-orange-500 text-xl font-medium">{stats.daysLeft} days left</p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
