"use client";

import { useEffect, useRef, useState } from "react";

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

/* ─── Floating Book Now Button ─── */
function FloatingBookButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="/book"
      className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 btn-premium px-6 py-3 sm:px-7 sm:py-3.5 bg-accent text-white text-sm font-medium rounded-full shadow-lg transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      Book Now
    </a>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-16 px-6 lg:px-10 overflow-hidden bg-background">
      {/* Top logo */}
      <div className="absolute top-8 left-6 lg:left-10 animate-fade-in opacity-0 z-10">
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
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <div>
            <div className="animate-reveal-up opacity-0">
              <p className="text-warm-gray text-sm tracking-wide mb-6">
                Your court is waiting
              </p>
            </div>

            <h1 className="animate-reveal-up opacity-0 delay-200 font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground mb-6 sm:mb-8">
              GRAB A PADDLE.
              <br />
              PICK A COURT.
            </h1>

            <p className="animate-reveal-up opacity-0 delay-400 text-warm-gray text-base sm:text-lg max-w-lg leading-relaxed mb-8 sm:mb-10">
              No lines, no waiting. Choose your time, tap to book, and show up
              ready to play. It takes less than a minute.
            </p>

            <div className="animate-reveal-up opacity-0 delay-600 flex items-center gap-5">
              <a
                href="/book"
                className="btn-premium group px-10 py-4 bg-accent text-white text-sm font-medium rounded-full flex items-center gap-2"
              >
                Book Your Court Now
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <span className="text-xs text-warm-gray-light animate-pulse hidden sm:inline">
                Takes 60 seconds
              </span>
            </div>
          </div>

          {/* Right - Stats Cards */}
          <div className="animate-float-in opacity-0 delay-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Big stat card */}
              <div className="sm:col-span-2 bg-card rounded-2xl border border-border p-5 sm:p-8 flex items-center justify-between hover-lift">
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
              <div className="bg-card rounded-2xl border border-border p-6 hover-lift animate-stagger-fade opacity-0 delay-600">
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

              <div className="bg-cream rounded-2xl border border-border p-6 flex items-center justify-center hover-lift animate-stagger-fade opacity-0 delay-700">
                <div className="w-full h-full min-h-[140px] rounded-xl bg-cream-dark/50 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-warm-gray-light mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="1" />
                      <circle cx="12" cy="12" r="3" strokeWidth="1" />
                      <line x1="12" y1="2" x2="12" y2="6" strokeWidth="1" />
                      <line x1="12" y1="18" x2="12" y2="22" strokeWidth="1" />
                    </svg>
                    <p className="text-xs text-warm-gray-light">Court Image</p>
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="bg-card rounded-2xl border border-border p-6 hover-lift animate-stagger-fade opacity-0 delay-700">
                <p className="text-sm text-warm-gray mb-1">Commitment to Excellence</p>
                <p className="font-serif text-4xl font-bold text-foreground">9/10</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 hover-lift animate-stagger-fade opacity-0 delay-800">
                <p className="text-sm font-medium text-foreground mb-1">Worldwide Express Delivery</p>
                <p className="text-xs text-warm-gray mb-3">
                  Enjoy fast and reliable booking
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
    </section>
  );
}

/* ─── About ─── */
function About() {
  const { ref, isVisible } = useInView();

  return (
    <section id="about" className="py-28 px-6 lg:px-10 bg-cream" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image placeholder */}
          <div className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="relative aspect-video sm:aspect-[4/5] bg-card rounded-3xl overflow-hidden border border-border hover-scale">
              <div className="absolute inset-0 bg-gradient-to-br from-cream-dark/30 via-transparent to-cream-dark/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto text-warm-gray-light/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1" />
                    <path d="M21 15l-5-5L5 21" strokeWidth="1" />
                  </svg>
                  <p className="text-warm-gray-light text-sm">Your Photo Here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`${isVisible ? "animate-reveal-up delay-200" : "opacity-0"}`}>
            <p className="text-warm-gray text-sm tracking-wide mb-4">About Us</p>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mb-8">
              DESIGNED FOR
              <br />
              EVERY JOURNEY
            </h2>
            <p className="text-warm-gray text-lg leading-relaxed mb-10">
              Every court tells a story. Whether you&apos;re stepping on for the first time
              or you&apos;re a seasoned pro, our facility is crafted to inspire your best game.
              We believe pickleball is more than a sport,it&apos;s a lifestyle.
            </p>

            {/* Feature cards */}
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border border-border p-6 flex gap-5 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Personalized Experience</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">
                    Tailored court sessions designed to match your skill level and playing style.
                  </p>
                  <a href="#courts" className="text-xs text-foreground underline mt-2 inline-block">Learn More</a>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 flex gap-5 hover-lift">
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Strong Community</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">
                    Join a thriving community of players who share your passion for the game.
                  </p>
                  <a href="#courts" className="text-xs text-foreground underline mt-2 inline-block">Learn More</a>
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

  return (
    <section id="courts" className="py-28 px-6 lg:px-10 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-20 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
          <p className="text-warm-gray text-sm tracking-wide mb-4">Our Facility</p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            COURTS BUILT FOR
            <br />
            EXCELLENCE
          </h2>
          <p className="text-warm-gray text-lg max-w-xl mx-auto leading-relaxed">
            Every detail has been meticulously crafted to deliver the ultimate
            pickleball experience.
          </p>
        </div>

        {/* Stats bar */}
        <div className={`bg-card rounded-2xl border border-border p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 hover-glow ${isVisible ? "animate-float-in delay-200" : "opacity-0"}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-foreground">10+</p>
              <p className="text-xs text-warm-gray">Award-Winning</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border" />
          <div>
            <div className="flex items-center gap-2 text-sm text-warm-gray">
              <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lifetime Repair Guarantee
            </div>
            <div className="flex items-center gap-2 text-sm text-warm-gray">
              <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom Shoe Fitting
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border" />
          <div className="text-center md:text-right">
            <p className="font-serif text-2xl font-bold text-foreground">95%</p>
            <p className="text-xs text-warm-gray">Customer Satisfaction</p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {courtFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className={`group bg-card rounded-2xl border border-border p-5 sm:p-7 hover-lift transition-all duration-500 ${
                isVisible ? `animate-fade-in-up delay-${(index + 2) * 100}` : "opacity-0"
              }`}
            >
              <h3 className="font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-sm text-warm-gray leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Membership ─── */
function Membership() {
  const { ref, isVisible } = useInView();

  const plans = [
    {
      name: "Drop-In",
      price: "15",
      period: "per session",
      features: [
        "Single court session",
        "Equipment rental available",
        "Open play access",
        "No commitment required",
      ],
      featured: false,
    },
    {
      name: "Member",
      price: "99",
      period: "per month",
      features: [
        "Unlimited court access",
        "Priority booking",
        "Free equipment rental",
        "Member events & tournaments",
        "Guest passes (2/month)",
      ],
      featured: true,
    },
    {
      name: "Elite",
      price: "199",
      period: "per month",
      features: [
        "Everything in Member",
        "Private court reservations",
        "Pro coaching sessions",
        "Exclusive elite events",
        "Unlimited guest passes",
        "Locker & storage",
      ],
      featured: false,
    },
  ];

  return (
    <section id="membership" className="py-28 px-6 lg:px-10 bg-cream" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <p className="text-warm-gray text-sm tracking-wide mb-4">Membership</p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            FIND YOUR PLAN
          </h2>
          <p className="text-warm-gray text-lg max-w-xl mx-auto leading-relaxed">
            From casual players to dedicated athletes, we have a membership
            that fits your game.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border transition-all duration-500 overflow-hidden ${
                plan.featured
                  ? "border-accent shadow-lg scale-[1.02]"
                  : "border-border hover:shadow-md"
              } ${isVisible ? `animate-fade-in-up delay-${(index + 1) * 100}` : "opacity-0"}`}
            >
              {plan.featured && (
                <div className="bg-accent text-white text-xs font-medium text-center py-2 tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-sm font-medium text-warm-gray uppercase tracking-wider mb-4">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-warm-gray">$</span>
                    <span className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-warm-gray mt-2">{plan.period}</p>
                </div>

                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-warm-gray">
                      <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#courts"
                  className={`block text-center py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                    plan.featured
                      ? "bg-accent text-white hover:bg-foreground"
                      : "border border-border text-foreground hover:border-accent"
                  }`}
                >
                  Get Started
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Exclusive CTA ─── */
function MapSection() {
  const { ref, isVisible } = useInView();

  return (
    <section className="py-28 px-6 lg:px-10 bg-background" ref={ref}>
      <div
        className={`max-w-5xl mx-auto ${isVisible ? "animate-reveal-up" : "opacity-0"}`}
      >
        <div className="text-center mb-10">
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
    <section className="py-28 px-6 lg:px-10 bg-cream" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-16 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
          <p className="text-warm-gray text-sm tracking-wide mb-4">FAQ</p>
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
              className="bg-card rounded-2xl border border-border overflow-hidden hover-glow"
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
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 pb-5" : "max-h-0"
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

  return (
    <section id="contact" className="py-28 px-6 lg:px-10 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div className={`${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <p className="text-warm-gray text-sm tracking-wide mb-4">Get In Touch</p>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mb-8">
              READY TO PLAY?
            </h2>
            <p className="text-warm-gray text-lg leading-relaxed mb-12">
              Book a court, ask about memberships, or just come say hello.
              We&apos;re here to help you get in the game.
            </p>

            <div className="space-y-6">
              {[
                { label: "Location", value: "123 Court Street, Your City", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                { label: "Hours", value: "Mon-Sun: 6:00 AM - 10:00 PM", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Email", value: "hello@pickleball.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { label: "Phone", value: "(555) 123-4567", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              onSubmit={(e) => e.preventDefault()}
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
                  <option>Membership Inquiry</option>
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
                className="w-full py-3.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-foreground transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Photo Gallery ─── */
function Gallery() {
  const { ref, isVisible } = useInView(0.1);

  const photos = [
    { label: "Aerial View", gradient: "from-[#3a8fd4] via-[#7b4fa0] to-[#3a8fd4]" },
    { label: "Night Session", gradient: "from-[#1e3a5f] via-[#5a3d7a] to-[#2a5f8f]" },
    { label: "Full Complex", gradient: "from-[#4a9fe4] via-[#8b5fb0] to-[#4a9fe4]" },
    { label: "Court Side", gradient: "from-[#2a6fa4] via-[#6b4f90] to-[#3a8fd4]" },
    { label: "Evening Play", gradient: "from-[#1a2a4f] via-[#4a3060] to-[#2a4a7f]" },
    { label: "Players View", gradient: "from-[#3a8fd4] via-[#9b6fc0] to-[#4a9fe4]" },
  ];

  return (
    <section className="py-28 px-6 lg:px-10 bg-cream" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-14 ${isVisible ? "animate-reveal-up" : "opacity-0"}`}>
          <p className="text-warm-gray text-sm tracking-wide mb-4">Gallery</p>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
            OUR COURTS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {photos.map((photo, index) => (
            <div
              key={photo.label}
              className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer ${
                isVisible ? `animate-scale-in delay-${(index + 1) * 100}` : "opacity-0"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${photo.gradient} gallery-zoom`}>
                <svg
                  className="absolute inset-0 w-full h-full opacity-30"
                  viewBox="0 0 400 300"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect x="60" y="40" width="280" height="220" rx="3" fill="none" stroke="white" strokeWidth="2" />
                  <line x1="200" y1="40" x2="200" y2="260" stroke="white" strokeWidth="2" />
                  <rect x="140" y="40" width="120" height="220" fill="white" opacity="0.12" />
                  <line x1="60" y1="150" x2="340" y2="150" stroke="white" strokeWidth="1.5" />
                  <circle cx="120" cy="100" r="5" fill="white" opacity="0.5" />
                  <circle cx="280" cy="200" r="5" fill="white" opacity="0.5" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {photo.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Info Strip ─── */
function InfoStrip() {
  return (
    <section className="py-10 px-6 lg:px-10 bg-accent text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
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
    <footer className="py-12 px-6 lg:px-10 border-t border-border bg-background">
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
          <a href="/" className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center text-warm-gray hover:text-accent hover:border-accent/30 transition-all duration-300" aria-label="Facebook">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="/" className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-border flex items-center justify-center text-warm-gray hover:text-accent hover:border-accent/30 transition-all duration-300" aria-label="Instagram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>

        <p className="text-xs text-warm-gray">
          &copy; {new Date().getFullYear()} Pickleball. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <main>
      <FloatingBookButton />
      <Hero />
      <About />
      <Courts />

      <Gallery />
      <MapSection />
      <FAQ />
      <InfoStrip />
      <Footer />
    </main>
  );
}
