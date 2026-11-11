import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ImagePlus } from "lucide-react";

const Home = () => {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden bg-neutral-900">
      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        .rise { animation: rise .9s ease-out both; }
        .hero-title { text-shadow: 0 2px 24px rgba(0,0,0,.8), 0 1px 3px rgba(0,0,0,.7); }
        @media (prefers-reduced-motion: reduce) { .rise { animation: none; } }
      `}</style>

      {/* Background video */}
      {!failed && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/a.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => {
            console.warn("Video load hoyni");
            setFailed(true);
          }}
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.6)_0%,rgba(0,0,0,.3)_55%,rgba(0,0,0,.1)_85%)]" />

      {/* Text */}
      <div className="relative z-30 flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <div className="rise max-w-3xl text-center">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Bring light back to your darkest photos
          </h1>
          <p className="hero-title text-base md:text-lg text-white/90 max-w-xl mx-auto mb-8">
            Upload a dim,grainy shot and watch the lost details return in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/studio"
              className="flex items-center gap-2 px-8 py-3.5 gradient-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <ImagePlus className="h-5 w-5" />
              Enhance a photo
            </Link>
            <Link
              to="/gallery"
              className="flex items-center gap-2 px-8 py-3.5 bg-black/60 border border-white/30 text-white rounded-xl font-bold hover:bg-black/75 transition-colors duration-300"
            >
              My gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;