const PrivacyPolicy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[80vh] animate-fade-in-up text-foreground">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-6">Last updated: November 2026</p>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Introduction</h2>
          <p>
            Welcome to LuxVision.We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our 
            website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Data We Collect</h2>
          <p>
            We may collect,use,store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Identity Data:</strong> Includes your name,username,or similar identifier.</li>
            <li><strong>Contact Data:</strong> Includes your email address and phone number.</li>
            <li><strong>Technical Data:</strong> Includes login data,browser type and version,time zone setting,and operating system.</li>
            <li><strong>Image Data:</strong> Photos you upload to our studio for AI enhancement and processing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>To provide and maintain our AI image enhancement service.</li>
            <li>To manage your account,profile,and available credits.</li>
            <li>To process your transactions and billing via secure payment gateways.</li>
            <li>To manage your image history and gallery.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. All image data and user credentials are processed securely using modern encryption and cloud storage standards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices,please contact us through your account or via support.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;