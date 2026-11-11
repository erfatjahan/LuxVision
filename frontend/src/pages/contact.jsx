import { Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-panel max-w-2xl w-full p-8 animate-fade-in-up relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Get in Touch</h1>
          <p className="text-muted-foreground mt-2">Have questions about LuxAI? We'd love to hear from you.</p>
        </div>

        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Name</label>
              <input type="text" className="w-full p-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Name please" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input type="email" className="w-full p-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="example@.com" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Message</label>
            <textarea rows="5" className="w-full p-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" placeholder="How can we help you?"></textarea>
          </div>

          <button className="w-full py-3 gradient-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 glow-on-hover hover:scale-[1.02] transition-all">
            <Send className="h-5 w-5" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;