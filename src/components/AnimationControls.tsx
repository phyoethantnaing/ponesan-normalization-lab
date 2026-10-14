import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
} from "lucide-react";
export interface ControlsProps {
  step: number;
  count: number;
  playing: boolean;
  speed: number;
  setStep: (n: number) => void;
  setPlaying: (v: boolean) => void;
  setSpeed: (n: number) => void;
  fullscreen: boolean;
  onFullscreen: () => void;
}
export default function AnimationControls(p: ControlsProps) {
  return (
    <div className="animation-controls">
      <div className="playback-buttons">
        <button
          title="Previous animation step"
          aria-label="Previous animation step"
          disabled={p.step === 0}
          onClick={() => {
            p.setPlaying(false);
            p.setStep(p.step - 1);
          }}
        >
          <SkipBack size={16} />
        </button>
        <button
          className="play-button"
          aria-label={p.playing ? "Pause animation" : "Play animation"}
          onClick={() => {
            if (p.step === p.count - 1) p.setStep(0);
            p.setPlaying(!p.playing);
          }}
        >
          {p.playing ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <button
          title="Next animation step"
          aria-label="Next animation step"
          disabled={p.step === p.count - 1}
          onClick={() => {
            p.setPlaying(false);
            p.setStep(p.step + 1);
          }}
        >
          <SkipForward size={16} />
        </button>
        <button
          title="Replay animation"
          aria-label="Replay animation"
          onClick={() => {
            p.setStep(0);
            p.setPlaying(true);
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="timeline" aria-label="Animation timeline">
        {Array.from({ length: p.count }, (_, i) => (
          <button
            key={i}
            title={`Step ${i + 1}`}
            aria-label={`Animation step ${i + 1}`}
            aria-current={i === p.step ? "step" : undefined}
            className={i <= p.step ? "filled" : ""}
            onClick={() => {
              p.setPlaying(false);
              p.setStep(i);
            }}
          />
        ))}
      </div>
      <span className="step-count">
        {p.step + 1} / {p.count}
      </span>
      <label className="speed-label">
        <span className="sr-only">Animation Speed</span>
        <select
          aria-label="Animation Speed"
          value={p.speed}
          onChange={(e) => p.setSpeed(Number(e.target.value))}
        >
          {[0.5, 1, 1.5, 2].map((v) => (
            <option key={v} value={v}>
              {v}×
            </option>
          ))}
        </select>
      </label>
      <button
        title="Fullscreen animation"
        aria-label={p.fullscreen ? "Exit fullscreen" : "Fullscreen animation"}
        onClick={p.onFullscreen}
      >
        {p.fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  );
}
