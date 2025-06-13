import { useState, useEffect } from 'react';

interface LocaleDateProps {
  date: string; // ISO string
  options?: Intl.DateTimeFormatOptions;
}

export default function LocaleDate({ date, options }: LocaleDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  const dateObj = new Date(date);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formatOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    // Only format date on client side to avoid hydration mismatch
    setFormattedDate(dateObj.toLocaleDateString(undefined, formatOptions));
  }, [date]);

  return (
    <time dateTime={dateObj.toISOString()}>
      {formattedDate || dateObj.toLocaleDateString('en-US', formatOptions)}
    </time>
  );
}
