import { useState, useEffect } from "react";
import { create } from "zustand";

import type { Report } from "./ipc";

import copyLogo from "./copy.svg";
import downloadLogo from "./download.svg";

import "./index.css";

import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js"
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, Title);
ChartJS.defaults.font.family = "Courier Prime";

interface RecorderState {
  reportMemory: [number, number][];
  readingMemory: number[];
  timestampMemory: number[];
  recording: boolean;
  toggleRecording: () => void;
  addToMemory: (report: Report) => void;
  clearMemory: () => void;
}

const useRecorderStore = create<RecorderState>()((set) => ({
  reportMemory: [],
  readingMemory: [],
  timestampMemory: [],
  recording: false,
  toggleRecording: () => set((state) => ({ recording: !state.recording })),
  addToMemory: ({ reading, timestamp }) => set((state) => ({
    reportMemory: [...state.reportMemory, [reading, timestamp]],
    readingMemory: [...state.readingMemory, reading],
    timestampMemory: [...state.timestampMemory, timestamp],
  })),
  clearMemory: () => set(() => ({ reportMemory: [], readingMemory: [], timestampMemory: [], })),
}));

interface ApiState {
  isConnected: boolean;
  latestReport: Report;
  setConnected: (connected: boolean) => void;
  setReport: (report: Report) => void;
}

const useApiStore = create<ApiState>()((set) => ({
  isConnected: false,
  latestReport: { isConnected: false, reading: 0, timestamp: 0 },
  setConnected: (connected) => set(() => ({ isConnected: connected })),
  setReport: (report) => set(() => ({ latestReport: report })),
}));

export function RightPanel() {
  const readingMemory = useRecorderStore((state) => state.readingMemory);
  const timestampMemory = useRecorderStore((state) => state.timestampMemory);
  const recorderStore = useRecorderStore();

  const MAX_SHOWN_POINTS = 15;

  const readings = readingMemory.slice(Math.max(recorderStore.readingMemory.length - MAX_SHOWN_POINTS, 0));
  const timestamps = timestampMemory.slice(Math.max(recorderStore.timestampMemory.length - MAX_SHOWN_POINTS, 0));

  const data = {
    labels: timestamps,
    datasets: [{
      data: readings,
      backgroundColor: 'rgb(30, 230, 136)',
      borderColor: 'rgb(30, 230, 136)',
      fill: true,
    }],
  };

  const options = {
    animation: {
      duration: 200,
    },
    scales: {
      y: {
        min: 30,
        max: 130,
        grid: {
          color: 'rgb(110, 110, 110)',
        },
        ticks: {
          color: `#FEFDFD`,
          font: {
            size: 16,
          },
        },
      },
      x: {
        grid: {
          color: 'rgb(110, 110, 110)',
        },
        ticks: {
          display: false,
        },
      },
    }
  };

  return (
    <div id="data" className="panel w-3/5 flex flex-auto mx-2 py-4 px-4 justify-center">
      <Line options={options} data={data} />
    </div>
  );
}

function handleFileDownload() {
  const memory = useRecorderStore.getState().reportMemory;

  if (memory.length == 0) return;

  let fileData = "reading, timestamp, unit, weighting\n";
  memory.forEach(([reading, timestamp]) => {
    fileData += `${reading.toString()}, ${new Date(timestamp).toISOString()}, dB, A`;
    fileData += "\n";
  });

  const blob = new Blob([fileData], { type: "text/plain" });
  const a = document.createElement("a");
  a.download = "data.csv";
  a.href = (window.webkitURL || window.URL).createObjectURL(blob);
  a.dataset.downloadurl = ["text/plain", a.download, a.href].join(":");
  a.click();
}

function fileSaveToClipboard() {

}

export function LeftPanel() {
  const recording = useRecorderStore((state) => state.recording);
  const toggleRecording = useRecorderStore((state) => state.toggleRecording);
  const clearMemory = useRecorderStore((state) => state.clearMemory);

  const [recordingLength, setRecordingLength] = useState(0);

  useEffect(() => {
    if (!recording)
      return;

    const interval = setInterval(() => {
      setRecordingLength(prev => prev + 1);
    }, 1000)

    return () => clearInterval(interval);
  }, [recording])

  let recordingLengthText = "00:00";

  if (recordingLength > 0) {
    let seconds = recordingLength;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let secondsStr = seconds.toString();
    secondsStr = secondsStr.padStart(2, "0");
    let minutesStr = minutes.toString();
    minutesStr = minutesStr.padStart(2, "0");

    recordingLengthText = minutesStr + ":" + secondsStr;
  }

  const { reading } = useApiStore((state) => state.latestReport);
  let readingText = reading.toString();

  // Append .0
  if (!readingText.includes("."))
    readingText = readingText + ".0";
  readingText = readingText.padStart(5, "0");

  const buttonText = recording ? "stop" : (recordingLength > 0 ? "clear" : "record");

  const handleButtonClick = () => {
    if (recordingLength > 0 && !recording) {
      clearMemory();
      setRecordingLength(0);
      return;
    }
    toggleRecording();
  }

  return (
    <div className="panel flex flex-col flex-1 mx-2 p-4">
      <div id="reading" className="flex flex-col gap-2">
        <span>
          current reading:
        </span>
        <span className="flex-1 text-7xl mfont font-bold">
          {readingText}
        </span>
        <span className="text-right">
          dB(A)
        </span>
      </div>
      <div className="">

      </div>
      <div className="mt-auto flex flex-col gap-2">
        <span>Recording Length: <span className="font-bold font-tnums">{recordingLengthText}</span> </span>
        <div id="save_buttons" className="flex flex-row h-16 gap-2">
          <button className="w-full flex-1 bg-button rounded-md py-5 flex justify-center cursor-pointer" disabled={recording}>
            <img src={copyLogo} alt="Copy" className={`max-h-full ${recording ? "opacity-25" : ""}`} />
          </button>
          <button className="w-full flex-1 bg-button rounded-md py-5 flex justify-center cursor-pointer" onClick={handleFileDownload} disabled={recording}>
            <img src={downloadLogo} alt="Save" className={`max-h-full ${recording ? "opacity-25" : ""}`} />
          </button>
        </div>
        <button className="w-full h-16 bg-red-600 rounded-md cursor-pointer font-bold" onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export function App() {
  const isConnected = useApiStore((state) => state.isConnected);
  const deviceStatus = isConnected ? "connected" : "disconnected";

  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/report")
        .then((res) => res.json())
        .then((report: Report) => {
          useApiStore.getState().setConnected(report.isConnected);
          useApiStore.getState().setReport(report);

          if (useRecorderStore.getState().recording)
            useRecorderStore.getState().addToMemory(report);
        });
    }, 500);

    return () => clearInterval(id);
  }, []);

  return (
    <div id="app" className="flex flex-col">
      <div className="topbar h-1/10 flex flex-row items-center mx-4 gap-2">
        <span className="font-semibold text-2xl w-1/5">beaver</span>
        <span className="ml-auto">device status: {deviceStatus}</span>
      </div>
      <div className="flex flex-row h-9/10 pb-4 px-2">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
