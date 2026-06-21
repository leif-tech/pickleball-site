export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
              PICKLEBALL
            </span>
          </a>
          <a href="/" className="text-xs text-warm-gray hover:text-foreground transition-colors">
            Back to Home
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-warm-gray mb-8">Last updated: June 2026</p>

        <div className="space-y-8 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">1. Information We Collect</h2>
            <p className="text-warm-gray">
              When you create an account, we collect your name, email address, and phone number. When you make a booking, we collect booking details including date, time, and court preferences. We may also collect usage data such as pages visited and interactions with our platform.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="text-warm-gray">
              We use your information to process bookings, manage your account, communicate important updates about your reservations, and improve our services. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">3. Data Security</h2>
            <p className="text-warm-gray">
              Your password is securely hashed and never stored in plain text. We use secure, HTTP-only cookies for authentication. All data transmission is encrypted. We take reasonable measures to protect your personal information from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">4. Payment Information</h2>
            <p className="text-warm-gray">
              Payment processing is handled by our payment partner. We do not store your credit card or payment account details on our servers. All payment data is processed securely through encrypted channels.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">5. Cookies</h2>
            <p className="text-warm-gray">
              We use essential cookies to maintain your login session. These cookies are necessary for the platform to function and cannot be opted out of. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">6. Data Retention</h2>
            <p className="text-warm-gray">
              We retain your account data as long as your account is active. Booking history is kept for record-keeping purposes. You may request deletion of your account and associated data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">7. Your Rights</h2>
            <p className="text-warm-gray">
              You have the right to access, correct, or delete your personal information. You may update your account details at any time. To request data deletion, contact us at hello@pickleball.com.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">8. Changes to This Policy</h2>
            <p className="text-warm-gray">
              We may update this privacy policy from time to time. We will notify you of significant changes by posting the updated policy on this page. Your continued use of our services after changes are posted constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">9. Contact</h2>
            <p className="text-warm-gray">
              For privacy-related inquiries, contact us at hello@pickleball.com or call (555) 123-4567.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-xs text-warm-gray">&copy; {new Date().getFullYear()} Pickleball. All rights reserved.</p>
      </footer>
    </div>
  );
}
