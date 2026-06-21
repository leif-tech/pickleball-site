"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}


/* ─── Hero ─── */
function Hero({ onAuthClick, user, onLogout }: { onAuthClick: (tab: "signup" | "login") => void; user: { name: string; role?: string } | null; onLogout: () => void }) {
  return (
    <section className="relative z-[1] min-h-screen flex flex-col" style={{ background: '#ffffff' }}>
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/court-hero.png"
          alt=""
          className="w-full h-full object-cover object-[center_5%] animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/25 to-transparent" />
        {/* Extra overlay on mobile for text readability */}
        <div className="absolute inset-0 bg-white/40 sm:hidden" />
      </div>

      {/* Top nav bar */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-10 pt-6 pb-4 animate-fade-in opacity-0">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <span className="font-serif text-xl font-semibold tracking-wide text-foreground">
            PICKLEBALL
          </span>
        </a>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "admin" && (
                <a
                  href="/admin"
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-accent border border-accent/30 rounded-full hover:bg-accent hover:text-white transition-all duration-200"
                >
                  Admin
                </a>
              )}
              <a
                href="/book"
                className="px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-white/15 backdrop-blur-sm border border-white/40 rounded-full hover:bg-white/25 transition-all duration-300"
              >
                Book &amp; Play
              </a>
              <button
                onClick={onLogout}
                className="hidden sm:inline-block px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <a
              href="/book"
              className="px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-white/15 backdrop-blur-sm border border-white/40 rounded-full hover:bg-white/25 transition-all duration-300"
            >
              Book &amp; Play
            </a>
          )}
        </div>
      </div>

      <div className="relative z-[1] flex-1 flex items-center px-6 lg:px-10 pb-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <div>
            <div className="animate-reveal-up opacity-0">
              <p className="text-foreground text-sm tracking-wide mb-6 font-medium animate-underline-draw">
                Your court is waiting
              </p>
            </div>

            <h1 className="animate-clip-reveal opacity-0 delay-200 font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground mb-6 sm:mb-8">
              <span className="shimmer-text">GRAB A PADDLE.</span>
              <br />
              <span className="shimmer-text" style={{ animationDelay: '2s' }}>PICK A COURT.</span>
            </h1>

            <p className="animate-reveal-up opacity-0 delay-400 text-foreground text-base sm:text-lg max-w-lg leading-relaxed mb-8 sm:mb-10">
              No lines, no waiting. Choose your time, tap to book, and show up
              ready to play. It takes less than a minute.
            </p>

            <div className="animate-reveal-up opacity-0 delay-600 flex items-center gap-5">
              <a
                href="/book"
                className="btn-premium click-bounce group px-10 py-4 bg-accent text-white text-sm font-medium rounded-full flex items-center gap-2 animate-soft-float"
              >
                Book Your Court Now
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <span className="text-xs text-foreground animate-pulse hidden sm:inline">
                Takes 60 seconds
              </span>
            </div>
          </div>

          {/* Right - Stats Cards */}
          <div className="animate-float-in opacity-0 delay-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Big stat card */}
              <div className="sm:col-span-2 bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-5 sm:p-8 flex items-center justify-between hover-tilt animate-border-glow">
                <div>
                  <p className="text-sm text-warm-gray mb-1">Perfect Fit for Everyone</p>
                  <p className="animate-count-up opacity-0 delay-500 font-serif text-3xl sm:text-5xl font-bold text-foreground">30+</p>
                </div>
                <div className="w-px h-16 bg-border" />
                <div>
                  <p className="text-sm text-warm-gray mb-1">Player Satisfaction</p>
                  <p className="animate-count-up opacity-0 delay-600 font-serif text-3xl sm:text-5xl font-bold text-foreground">85%</p>
                </div>
              </div>

              {/* Smaller stat cards */}
              <div className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-6 hover-lift animate-stagger-fade opacity-0 delay-600">
                <p className="text-sm text-warm-gray mb-1">Courts Available</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-serif text-4xl font-bold text-foreground">108+</p>
                  <p className="font-serif text-2xl font-bold text-foreground">90%</p>
                </div>
                <p className="text-xs text-warm-gray-light mt-2">
                  our players rate us as the best courts they&apos;ve ever played on
                </p>
                <a href="#courts" className="text-xs text-foreground underline mt-3 inline-block">
                  Learn More
                </a>
              </div>

              <div className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-6 hover-lift animate-stagger-fade opacity-0 delay-700">
                <p className="text-sm text-warm-gray mb-1">Open Daily</p>
                <p className="font-serif text-4xl font-bold text-foreground">16<span className="text-lg font-medium text-warm-gray ml-1">hrs</span></p>
                <p className="text-xs text-warm-gray-light mt-2">6:00 AM to 10:00 PM, every day of the week</p>
              </div>

              {/* Bottom row */}
              <div className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-6 hover-lift animate-stagger-fade opacity-0 delay-700">
                <p className="text-sm text-warm-gray mb-1">Commitment to Excellence</p>
                <p className="font-serif text-4xl font-bold text-foreground">9/10</p>
              </div>

              <div className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-6 hover-lift animate-stagger-fade opacity-0 delay-800">
                <p className="text-sm font-medium text-foreground mb-1">Community of Players</p>
                <p className="text-xs text-warm-gray mb-3">
                  Join a growing community of pickleball enthusiasts
                </p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-cream-dark border-2 border-card"
                    />
                  ))}
                </div>
                <p className="text-xs text-warm-gray mt-2">120+ active players</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}



/* ─── Courts ─── */
function Courts() {
  const { ref, isVisible } = useInView();
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

  // Escape key to close lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const courtFeatures = [
    {
      title: "Pro-Grade Surfaces",
      description: "Tournament-quality court surfaces engineered for optimal ball bounce and player safety.",
    },
    {
      title: "LED Court Lighting",
      description: "State-of-the-art LED lighting for evening play with zero glare and full visibility.",
    },
    {
      title: "Climate Controlled",
      description: "Indoor courts with perfect temperature year-round for comfortable play in any season.",
    },
    {
      title: "Premium Amenities",
      description: "Clean restrooms, shaded seating, equipment rental, and a refreshment lounge.",
    },
  ];

  const photos = [
    { label: "Court Front View", src: "/court-1.png" },
    { label: "Side Angle", src: "/court-2.png" },
    { label: "Net Close-up", src: "/court-3.png" },
    { label: "Full Court", src: "/court-4.png" },
    { label: "Aerial View", src: "/court-5.png" },
    { label: "Bird's Eye", src: "/court-6.png" },
    { label: "Top Down", src: "/court-7.png" },
    { label: "Wide Court", src: "/court-8.png" },
  ];

  return (
    <section id="courts" className="relative z-[1] pt-12 sm:pt-14 pb-6 sm:pb-8 px-6 lg:px-10 bg-cream" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-8 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
          <p className="text-warm-gray text-sm tracking-wide mb-3">Our Facility</p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            COURTS BUILT FOR
            <br />
            EXCELLENCE
          </h2>
          <p className="text-warm-gray text-lg max-w-xl mx-auto leading-relaxed">
            Every detail has been meticulously crafted to deliver the ultimate
            pickleball experience.
          </p>
        </div>

        {/* Feature grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isVisible ? "animate-float-in delay-200" : "opacity-0"}`}>
          {courtFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl border border-border p-5 sm:p-7 hover-tilt transition-all duration-500"
            >
              <h3 className="font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-warm-gray leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Court Photos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.label}
              onClick={() => setLightbox(photo)}
              className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer hover-tilt ${
                isVisible ? `animate-tilt-in delay-${(index + 2) * 100}` : "opacity-0"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.label}
                className="absolute inset-0 w-full h-full object-cover gallery-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {photo.label}
                </span>
              </div>
              {/* Zoom icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <div className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md animate-fade-in opacity-0"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-5xl w-full animate-scale-in opacity-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.label}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <span className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                {lightbox.label}
              </span>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors click-bounce"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Prev/Next */}
            <button
              onClick={() => {
                const idx = photos.findIndex((p) => p.src === lightbox.src);
                setLightbox(photos[(idx - 1 + photos.length) % photos.length]);
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors click-bounce"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                const idx = photos.findIndex((p) => p.src === lightbox.src);
                setLightbox(photos[(idx + 1) % photos.length]);
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors click-bounce"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


/* ─── Exclusive CTA ─── */
function MapSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="relative z-[1] pt-4 pb-12 sm:pb-14 px-6 lg:px-10 bg-cream" ref={ref}>
      <div
        className={`max-w-5xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}
      >
        <div className="text-center mb-6">
          <p className="text-warm-gray text-sm tracking-wide mb-4">Find Us</p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
            OUR LOCATION
          </h2>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.5!2d125.62!3d7.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDQnMTIuMCJOIDEyNcKwMzcnMTIuMCJF!5e0!3m2!1sen!2sph!4v1600000000000"
            width="100%"
            height="350"
            className="w-full h-[280px] sm:h-[450px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Pickleball Location"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const { ref, isVisible } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can I walk in without a reservation?",
      a: "Walk-ins are welcome when courts are available, but we highly recommend booking online to guarantee your slot. Peak hours tend to fill up fast, especially on weekends.",
    },
    {
      q: "Is there parking available on-site?",
      a: "Yes, we have a dedicated parking area right next to the facility with plenty of space for cars and motorcycles. It is free for all players during their booked hours.",
    },
    {
      q: "Are kids and pets allowed inside the facility?",
      a: "Kids are welcome and can play on the courts with supervision. Well-behaved pets on leashes are allowed in the lounge and viewing areas, but not on the court surfaces.",
    },
    {
      q: "What happens if it rains during my outdoor booking?",
      a: "If rain interrupts your session, we will either move you to an available indoor court or credit your account for the remaining time. Just check in with the front desk.",
    },
    {
      q: "Do you offer group rates or private events?",
      a: "We do. Whether it is a birthday party, corporate team building, or a weekend tournament with friends, reach out to us and we will put together a custom package for your group.",
    },
  ];

  return (
    <section id="faq" className="relative z-[1] py-12 sm:py-14 px-6 lg:px-10 bg-background" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-8 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
          <p className="text-warm-gray text-sm tracking-wide mb-3">FAQ</p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
            FREQUENTLY ASKED
            <br />
            QUESTIONS
          </h2>
        </div>

        <div className={`space-y-3 ${isVisible ? "animate-reveal-up delay-200" : "opacity-0"}`}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border overflow-hidden hover-glow click-bounce"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-warm-gray shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden faq-answer ${
                  openIndex === index ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 text-sm text-warm-gray leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const { ref, isVisible } = useInView();
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative z-[1] py-12 sm:py-14 px-6 lg:px-10 bg-cream" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left */}
          <div className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <p className="text-warm-gray text-sm tracking-wide mb-4">Get In Touch</p>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mb-5">
              READY TO PLAY?
            </h2>
            <p className="text-warm-gray text-lg leading-relaxed mb-8">
              Book a court, ask about pricing, or just come say hello.
              We&apos;re here to help you get in the game.
            </p>

            <div className="space-y-6">
              {[
                { label: "Location", value: "123 Court Street, Your City", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                { label: "Hours", value: "Mon-Sun: 6:00 AM - 10:00 PM", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Email", value: "hello@pickleball.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Phone", value: "(555) 123-4567", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
              ].map((item) => (
                <div key={item.label} className="group flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-accent hover-spin-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-foreground text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className={`${isVisible ? "animate-slide-in-right delay-200" : "opacity-0"}`}>
            <form
              className="bg-card rounded-2xl border border-border p-8 space-y-5"
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            >
              <div>
                <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground placeholder-warm-gray-light text-sm focus:outline-none focus:border-accent/40 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground placeholder-warm-gray-light text-sm focus:outline-none focus:border-accent/40 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Interest</label>
                <select className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-accent/40 transition-colors">
                  <option>Book a Court</option>
                  <option>Pricing Inquiry</option>
                  <option>Private Events</option>
                  <option>General Question</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-warm-gray uppercase tracking-wider mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full bg-cream border border-border rounded-xl px-4 py-3 text-foreground placeholder-warm-gray-light text-sm focus:outline-none focus:border-accent/40 transition-colors resize-none"
                  placeholder="Tell us what you're looking for..."
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-foreground transition-all duration-300 disabled:opacity-50"
              >
                {submitted ? "Message Sent!" : "Send Message"}
              </button>
              {submitted && (
                <p className="text-center text-sm text-accent font-medium animate-fade-in-up">
                  Thanks! We&apos;ll get back to you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── Info Strip ─── */
function InfoStrip() {
  return (
    <section className="relative z-[1] py-8 px-6 lg:px-10 bg-accent text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left animate-fade-in">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs opacity-60 uppercase tracking-wider">Hours</p>
            <p className="text-sm font-medium">Mon - Sun, 6:00 AM - 10:00 PM</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-white/20" />
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <p className="text-xs opacity-60 uppercase tracking-wider">Phone</p>
            <p className="text-sm font-medium">(555) 123-4567</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-white/20" />
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <div>
            <p className="text-xs opacity-60 uppercase tracking-wider">Location</p>
            <p className="text-sm font-medium">123 Court Street, Your City</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="relative z-[1] py-8 px-6 lg:px-10 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
            PICKLEBALL
          </span>
        </a>

        <div className="flex items-center gap-4">
          <a href="/" className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center text-warm-gray hover:text-accent hover:border-accent/30 transition-all duration-300 hover:scale-110" aria-label="Facebook">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="/" className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center text-warm-gray hover:text-accent hover:border-accent/30 transition-all duration-300 hover:scale-110" aria-label="Instagram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs text-warm-gray">
            &copy; {new Date().getFullYear()} Pickleball. All rights reserved.
          </p>
          <a href="/terms" className="text-xs text-warm-gray hover:text-foreground transition-colors">Terms</a>
          <a href="/privacy" className="text-xs text-warm-gray hover:text-foreground transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<"signup" | "login">("signup");

  const openAuth = (tab: "signup" | "login") => {
    setAuthTab(tab);
    setShowAuth(true);
  };

  return (
    <main>
      <Hero onAuthClick={openAuth} user={user} onLogout={logout} />
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} initialTab={authTab} redirectTo="/book" />
      )}
      <Courts />
<MapSection />
      <FAQ />
      <InfoStrip />
      <Footer />
    </main>
  );
}
