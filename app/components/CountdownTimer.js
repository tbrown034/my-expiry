import { useState, useEffect, memo } from 'react';
import { calculateHoursUntilExpiry, formatCountdown } from '../../lib/utils';

const CountdownTimer = memo(function CountdownTimer({ expiryDate, className = "" }) {
  const [hoursUntilExpiry, setHoursUntilExpiry] = useState(() => 
    calculateHoursUntilExpiry(expiryDate)
  );

  useEffect(() => {
    const updateCountdown = () => {
      setHoursUntilExpiry(calculateHoursUntilExpiry(expiryDate));
    };

    // Update immediately
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  const getTextColor = () => {
    if (hoursUntilExpiry < 0) return 'text-red-600';
    if (hoursUntilExpiry <= 24) return 'text-orange-600'; // Less than 24 hours
    if (hoursUntilExpiry <= 72) return 'text-yellow-600'; // Less than 3 days
    return 'text-green-600';
  };

  return (
    <span className={`font-bold ${getTextColor()} ${className}`}>
      {formatCountdown(hoursUntilExpiry)}
    </span>
  );
});

export default CountdownTimer;