import { CheckCircle, ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-glow border border-green-500/20">
        <CheckCircle className="w-12 h-12" />
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 flex items-center justify-center gap-2">
        Thank You!
      </h1>
      
      
      {/* Special Note Box */}
      <div className="max-w-md w-full bg-card border border-border p-5 rounded-2xl shadow-sm mb-8 text-left space-y-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Special Note</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your payment has been successfully processed,and Pro Plan credits have been added to your account.You can now enjoy unlimited AI image enhancements and premium features for your projects!
        </p>
      </div>

    </div>
  );
};

export default PaymentSuccess;