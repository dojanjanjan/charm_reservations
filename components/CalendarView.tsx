import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from './Icons';
import { useReservations } from '../hooks/useReservations';
import { useLanguage } from '../hooks/useLanguage';

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateChange }) => {
  const { language } = useLanguage();
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { reservations } = useReservations();

  // Ref for swipe gestures to avoid re-renders on touch move
  const touchStartX = useRef<number | null>(null);

  const reservationDates = useMemo(() => {
    const dates = new Set<string>();
    reservations.forEach(res => dates.add(res.date));
    return dates;
  }, [reservations]);

  const daysOfWeek = useMemo(() => {
    if (language === 'th') {
      return ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
    } else if (language === 'de') {
      return ['M', 'D', 'M', 'D', 'F', 'S', 'S'];
    }
    return ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  }, [language]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  // --- Swipe Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (diff > swipeThreshold) {
      // Swiped left
      handleNextMonth();
    } else if (diff < -swipeThreshold) {
      // Swiped right
      handlePrevMonth();
    }

    touchStartX.current = null;
  };

  const renderCalendar = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    // Monday-based: 0=Mon, 1=Tue, ..., 6=Sun
    let firstDayOfMonth = new Date(year, month, 1).getDay();
    firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const totalDays = getDaysInMonth(year, month);
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    
    return [...blanks, ...days].map((day, index) => {
      if (!day) {
        return <div key={`blank-${index}`} className="p-2"></div>;
      }
      const currentDate = new Date(year, month, day);
      const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      const hasReservations = reservationDates.has(dateString);
      const isSelected = selectedDate.toDateString() === currentDate.toDateString();
      const isToday = today.toDateString() === currentDate.toDateString();
      const isPast = currentDate < today;

      let buttonClasses = "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] relative transform";
      
      if (isPast) {
        buttonClasses += " text-gray-400 cursor-not-allowed";
      } else if (isSelected) {
        buttonClasses += " btn-gradient text-vanilla font-bold shadow-lg scale-110";
      } else if (isToday) {
        buttonClasses += " bg-black/5 text-[var(--color-primary)] hover:bg-black/10";
      } else {
        buttonClasses += " hover:bg-black/5 hover:scale-110";
      }

      return (
        <div key={day} className="flex justify-center items-center p-1">
          <button
            onClick={() => !isPast && onDateChange(currentDate)}
            disabled={isPast}
            className={buttonClasses}
          >
            {day}
            {hasReservations && <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-vanilla' : 'bg-[var(--color-primary)]'}`}></div>}
          </button>
        </div>
      );
    });
  };

  const localeMap = {
    en: 'en-US',
    de: 'de-DE',
    th: 'th-TH'
  };

  return (
    <div className="glass-pane p-4 sm:p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4 gap-2">
        <button onClick={handlePrevMonth} className="p-3 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex-1 text-center px-4 py-2 rounded-lg hover:bg-black/5 transition-colors group focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-expanded={!isCollapsed}
          aria-controls="calendar-grid"
        >
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-lg font-bold text-gray-800 select-none">
              {displayDate.toLocaleString(localeMap[language], { month: 'long', year: 'numeric' })}
            </h2>
            <ChevronsUpDown size={18} className={`text-gray-500 transition-transform duration-300 group-hover:text-gray-900 ${isCollapsed ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        <button onClick={handleNextMonth} className="p-3 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div 
        id="calendar-grid" 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-[320px]'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium mb-2">
          {daysOfWeek.map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;