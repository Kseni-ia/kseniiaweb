import { useEffect, useState } from 'react';

export function AnimatedStats() {
  const [count, setCount] = useState(0);
  const targetCount = 500;
  const duration = 2000; // 2 seconds
  const framesPerSecond = 60;
  const totalFrames = (duration / 1000) * framesPerSecond;
  const incrementPerFrame = targetCount / totalFrames;

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const newCount = Math.min(Math.round(frame * incrementPerFrame), targetCount);
      setCount(newCount);

      if (frame >= totalFrames) {
        clearInterval(counter);
      }
    }, 1000 / framesPerSecond);

    return () => clearInterval(counter);
  }, []);

  return (
    <div className="absolute -bottom-6 -left-6 bg-[#6B6B45] text-white p-4 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
      <p className="font-semibold text-2xl">
        {count}+ <span className="text-lg">Students Taught</span>
      </p>
      <p className="text-sm opacity-90">CELTA Certified</p>
    </div>
  );
}