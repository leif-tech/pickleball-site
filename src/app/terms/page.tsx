export default function TermsPage() {
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
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Terms and Conditions</h1>
        <p className="text-sm text-warm-gray mb-8">Last updated: June 2026</p>

        <div className="prose-custom space-y-8 text-sm text-foreground leading-relaxed">
          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-warm-gray">
              By accessing or using the Pickleball court booking platform, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">2. Account Registration</h2>
            <p className="text-warm-gray">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">3. Bookings and Payments</h2>
            <p className="text-warm-gray">
              All court bookings are subject to availability. Rates are displayed at the time of booking. Peak hours (4:00 PM - 9:00 PM) are charged at a higher rate. Once a booking is confirmed and paid for, the slot is reserved for you.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">4. Cancellation Policy</h2>
            <p className="text-warm-gray">
              Cancellations made at least 24 hours before the booked time are eligible for a full refund. Cancellations within 24 hours may be subject to a cancellation fee. No-shows will not be refunded.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">5. Facility Rules</h2>
            <p className="text-warm-gray">
              Players must adhere to all facility rules, including proper court footwear, respectful behavior, and adherence to booked time slots. The management reserves the right to refuse service to anyone violating facility rules.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">6. Liability</h2>
            <p className="text-warm-gray">
              Pickleball is a physical sport. You participate at your own risk. We are not liable for any injuries sustained during play. Players are encouraged to warm up properly and play within their skill level.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">7. Modifications</h2>
            <p className="text-warm-gray">
              We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg text-foreground mb-3">8. Contact</h2>
            <p className="text-warm-gray">
              For questions about these terms, contact us at hello@pickleball.com or call (555) 123-4567.
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
