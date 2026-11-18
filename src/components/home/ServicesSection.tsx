import Link from "next/link";

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    title: "Self-Drive Rentals",
    description: "Take the wheel yourself. Valid licence required. Perfect for local and foreign visitors exploring Sri Lanka at their own pace.",
    href: "/self-drive-rental",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Chauffeur Service",
    description: "Travel in comfort with an experienced, professional driver. Ideal for business trips, tours, and special occasions.",
    href: "/services",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: "Airport Transfers",
    description: "Reliable, punctual airport pickups and drop-offs. Available 24/7 for all major airports in Sri Lanka.",
    href: "/services",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Wedding & Events",
    description: "Make your special day unforgettable with our elegantly decorated luxury vehicles and professional service.",
    href: "/weddings",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 md:py-28 bg-charcoal-800" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">What We Offer</p>
          <h2 id="services-heading" className="font-display text-4xl md:text-5xl font-bold text-cream">
            Our Services
          </h2>
          <span className="block w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group bg-charcoal rounded-lg border border-charcoal-700 hover:border-gold/50 p-7 transition-all duration-300 flex flex-col"
            >
              <div className="text-gold mb-5 group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <h3 className="font-display text-xl font-semibold text-cream mb-3 group-hover:text-gold transition-colors">
                {s.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed flex-1">{s.description}</p>
              <span className="mt-5 text-gold text-sm font-medium inline-flex items-center gap-1">
                Learn more
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
