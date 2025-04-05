"use client";
import { useEffect, useState } from "react";
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 30);
    endDate.setHours(23, 59, 59, 999);

    const timeRemaining = endDate.getTime() - now.getTime();

    if (timeRemaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeRemaining / (1000 * 60)) % 60),
      seconds: Math.floor((timeRemaining / 1000) % 60),
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(interval);
  }, []);

  if (timeLeft === null) {
    return <div></div>;
  }
  return (
    <div className=" hidden w-full h-10 bg-purple-primary font-inter text-white p-7 text-sm md:flex items-center">
      <div className="flex 2xl:justify-between items-center w-3/4 mx-auto justify-center">
        <h4 className="2xl:inline-block hidden">
          FREE delivery & 40% Discount for next 3 orders! Place your 1st order in.
        </h4>
        <div className="flex items-center">
          <h4 className="2xl:hidden block">Discount for your next 3 orders: </h4>
          <p className="text-md">
            <span className="2xl:inline-block hidden">Until the end of the sale:</span>
            <strong className="pl-2.5 text-lg">{timeLeft.days}</strong> days
            <strong className="pl-2.5 text-lg">{timeLeft.hours}</strong> hours
            <strong className="pl-2.5 text-lg">{timeLeft.minutes}</strong> minutes
            <strong className="pl-2.5 text-lg">{timeLeft.seconds}</strong> seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
