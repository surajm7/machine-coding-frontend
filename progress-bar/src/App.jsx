import { useState, useEffect } from 'react';
import './App.css';
import ProgressBar from './ProgressBar';

function App() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const step = 1; // increment per tick
  const speed = 20; // ms interval

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setProgress((p) => (p + step > 100 ? 100 : p + step));
    }, speed);

    return () => clearInterval(id);
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    setProgress(0);
  };

  return (
    <div className="App p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Animated Progress Bars</h2>

      {/* Multiple Progress Bars */}
      <ProgressBar progress={progress} color="lightgreen" />
      <ProgressBar progress={progress} color="lightblue" />
      <ProgressBar progress={progress} color="yellow" />

      {/* Controls */}
      <div className="flex gap-2 mt-3">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
