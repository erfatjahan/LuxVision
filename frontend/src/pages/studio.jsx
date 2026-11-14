import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  UploadCloud,
  X,
  Loader2,
  Download,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const USE_MOCK = false;
const MAX_MB = 5;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const STEPS = [
  "Analyzing your photo…",
  "Separating light and detail…",
  "Restoring lost pixels…",
  "Finishing touches…",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function enhanceImage(file) {
  if (USE_MOCK) {
    await sleep(3500);
    return URL.createObjectURL(file);
  }

  const fd = new FormData();
  fd.append("file", file);

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/image/enhance`, { 
    method: "POST", 
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: fd 
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong. Please try again.");
  }

  return data.enhanced_image; 
}

const Studio = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [strength, setStrength] = useState(100);
  const [split, setSplit] = useState(50);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const stageRef = useRef(null);
  const dragging = useRef(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.imageUrl) {
      setPreviewUrl(location.state.imageUrl);
      setPhase("ready");
      
      fetch(location.state.imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const simulatedFile = new File([blob], "re-enhanced-image.jpg", { type: blob.type });
          setFile(simulatedFile);
        })
        .catch(() => {
          setFile({ name: "previous-image.jpg", size: 1024 * 1024, type: "image/jpeg" });
        });
    }
  }, [location.state]);

  useEffect(() => {
    if (phase !== "enhancing") return;
    setStepIdx(0);
    const id = setInterval(() => setStepIdx((i) => (i + 1) % STEPS.length), 1200);
    return () => clearInterval(id);
  }, [phase]);

  const pickFile = (f) => {
    setError("");
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      setError("Please upload a JPG, PNG or WEBP photo.");
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`This photo is larger than ${MAX_MB} MB. Please upload a smaller one.`);
      return;
    }
    if (previewUrl && !location.state?.imageUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setSplit(50);
    setPhase("ready");
  };

  const reset = () => {
    if (previewUrl && !location.state?.imageUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setPhase("idle");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEnhance = async () => {
    if (!file) return;
    setError("");
    setPhase("enhancing");
    try {
      let fileToUpload = file;
      if (!(file instanceof File)) {
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        fileToUpload = new File([blob], "image.jpg", { type: blob.type || "image/jpeg" });
      }

      const url = await enhanceImage(fileToUpload);
      setResultUrl(url);
      setPhase("done");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      setPhase("ready");
    }
  };

  const moveSplit = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    setSplit(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "enhanced.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      const a = document.createElement("a");
      a.href = resultUrl;
      a.download = "enhanced.png";
      a.target = "_blank";
      a.click();
    }
  };

  const levelLabel = strength < 34 ? "Low" : strength < 67 ? "Medium" : "High";

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[90vh] animate-fade-in-up">
      <style>{`
        @keyframes scan {
          0%   { top: -4%; }
          100% { top: 100%; }
        }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 3px;
          background: hsl(var(--primary));
          box-shadow: 0 0 24px 6px hsl(var(--primary) / .55);
          animation: scan 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) { .scan-line { animation: none; top: 50%; } }
      `}</style>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Image Studio</h1>
        <p className="text-muted-foreground">Upload your low-light image to enhance it</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 glass-panel h-[500px] relative flex items-center justify-center overflow-hidden transition-colors ${
            phase === "idle"
              ? `border-dashed border-2 ${dragOver ? "border-primary bg-primary/10" : "border-primary/40 hover:border-primary"}`
              : "border border-border"
          }`}
          onDragOver={(e) => {
            if (phase !== "idle") return;
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (phase === "idle") pickFile(e.dataTransfer.files[0]);
          }}
        >
          {phase === "idle" && (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-center w-full h-full flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <UploadCloud className="h-12 w-12 text-primary" />
              </span>
              <h3 className="text-xl font-semibold text-foreground">Drop your photo here</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                or click to browse. JPG, PNG, WEBP up to {MAX_MB} MB
              </p>
              <span className="px-6 py-2.5 gradient-primary text-primary-foreground rounded-xl font-semibold">
                Choose a photo
              </span>
            </button>
          )}

          {(phase === "ready" || phase === "enhancing") && previewUrl && (
            <div className="w-full h-full relative bg-black/40">
              <img src={previewUrl} alt="Uploaded" className="w-full h-full object-contain" />

              {phase === "enhancing" && (
                <>
                  <div className="absolute inset-0 bg-background/40" />
                  <div className="scan-line" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 rounded-full bg-background/90 border border-border px-5 py-2.5 text-sm font-medium text-foreground shadow-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    {STEPS[stepIdx]}
                  </div>
                </>
              )}

              {phase === "ready" && (
                <button
                  onClick={reset}
                  aria-label="Remove photo"
                  className="absolute top-4 right-4 p-2 bg-background/90 border border-border rounded-full text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {phase === "done" && previewUrl && resultUrl && (
            <div
              ref={stageRef}
              className="relative w-full h-full bg-black/40 touch-none select-none cursor-ew-resize"
              onPointerDown={(e) => {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                moveSplit(e);
              }}
              onPointerMove={(e) => dragging.current && moveSplit(e)}
              onPointerUp={() => (dragging.current = false)}
            >
              <img src={previewUrl} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
              <img
                src={resultUrl}
                alt="Enhanced"
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  opacity: strength / 100,
                  clipPath: `inset(0 0 0 ${split}%)`,
                }}
              />

              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_12px_hsl(var(--primary))] pointer-events-none"
                style={{ left: `${split}%` }}
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg text-xs font-bold">
                  ⇆
                </span>
              </div>

              <span className="absolute top-4 left-4 rounded-full bg-background/90 border border-border px-3 py-1 text-xs font-semibold text-foreground">
                Before
              </span>
              <span className="absolute top-4 right-4 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                After
              </span>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => pickFile(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </div>

        <div className="glass-panel lg:self-start flex flex-col gap-4 !p-4">
          {file && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="strength" className="text-sm font-medium text-foreground">
                Enhancement Level
              </label>
              <span className="text-xs text-primary font-semibold">
                {levelLabel} · {strength}%
              </span>
            </div>
            <input
              id="strength"
              type="range"
              min="0"
              max="100"
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {phase === "done" ? (
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[hsl(194_62%_32%)] text-white hover:bg-[hsl(194_62%_38%)] transition-colors duration-300 cursor-pointer"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
              <button
                onClick={reset}
                className="w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Try another photo
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnhance}
              disabled={!file || phase === "enhancing"}
              className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors duration-300 ${
                !file || phase === "enhancing"
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-[hsl(194_62%_32%)] text-white hover:bg-[hsl(194_62%_38%)] cursor-pointer"
              }`}
            >
              {phase === "enhancing" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing…
                </>
              ) : (
                "Auto Enhance"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Studio;