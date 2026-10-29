import React, { useState, useEffect } from "react";

export default function TopBar() {
  const [timeString, setTimeString] = useState("");
  const [visitorCount, setVisitorCount] = useState(12480);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("en-US");
      setTimeString(`${date}  |  ${time}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let count = parseInt(localStorage.getItem("fv_visitors"));
    if (isNaN(count)) {
      count = 12480;
    }
    if (!sessionStorage.getItem("fv_counted")) {
      count++;
      localStorage.setItem("fv_visitors", count);
      sessionStorage.setItem("fv_counted", "yes");
    }
    setVisitorCount(count);
  }, []);

  return (
    <div className="top-bar">
      <div className="container">
        <span>
          Time: <span className="live-clock">{timeString || "Loading..."}</span>
        </span>
        <span>
          Visitors: <span className="visitor-count">{visitorCount.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}
