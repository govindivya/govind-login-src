import { useEffect, useState } from "react";

const Loading = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 100);
    });
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="loding">
      {time < 10000 ? (
        <p>Please wait.... !</p>
      ) : (
        <p>It is taking more time than usual.</p>
      )}
    </div>
  );
};

export default Loading;
