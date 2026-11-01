import { useEffect, useState } from "react";

function diff(target) {
  const ms = Math.max(0, new Date(target) - Date.now());
  return {
    Days: Math.floor(ms / 86400000),
    Hours: Math.floor((ms / 3600000) % 24),
    Mins: Math.floor((ms / 60000) % 60),
    Secs: Math.floor((ms / 1000) % 60),
  };
}

// Live countdown that updates every second using setInterval
export default function Countdown({ target }) {
  const [left, setLeft] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="d-flex gap-2 gap-md-3">
      {Object.entries(left).map(([label, value]) => (
        <div key={label} className="countdown-box text-center">
          <div className="countdown-num">{String(value).padStart(2, "0")}</div>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
