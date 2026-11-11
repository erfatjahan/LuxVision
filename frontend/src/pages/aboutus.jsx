import { Sparkles, Zap, ShieldCheck, Image as ImageIcon } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto min-h-[80vh] animate-fade-in-up text-foreground">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
          About <span className="text-primary">LuxVision</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transforming the way you restore memories.LuxVision is a next-generation AI-powered image enhancement SaaS platform designed to bring light, clarity, and detail back to your darkest and grainy photos.
        </p>
      </div>

      {/* Core Highlights / Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <Sparkles className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-bold mb-2">Advanced AI Models</h3>
          <p className="text-sm text-muted-foreground">
            Powered by cutting-edge deep learning architectures to intelligently restore low-light and blurred images.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <Zap className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
          <p className="text-sm text-muted-foreground">
            Get your enhanced studio-quality photos back in seconds with our optimized cloud processing pipeline.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <ShieldCheck className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-lg font-bold mb-2">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">
            Your personal photos and history are stored securely with enterprise-grade cloud storage protection.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="glass-panel p-8 rounded-2xl border border-border/50 bg-card/30">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-primary" /> Our Mission
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We believe every photo tells a story, and no memory should remain hidden in the shadows.Whether it is an underexposed sunset shot or a grainy indoor memory,LuxVision empowers creators,photographers,and everyday users to reveal the true beauty of their images effortlessly.
        </p>
        <p className="text-sm text-primary font-medium">
          — Built with passion for the future of AI & visual enhancement.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;