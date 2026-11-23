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
    description: "Reliable, punctual airport pickups and drop-offs. Book ahead on WhatsApp for airport pickups and drop-offs.",
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
    <section className="section-pad bg-paper" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p className="eyebrow mb-4">Considered service</p>
            <h2 id="services-heading" className="editorial-heading text-ink">Every detail, made easy.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink/75">
            From a smooth airport arrival to a long island escape, we make the journey feel effortless.
          </p>
        </div>
        <div className="grid border-t border-line md:grid-cols-2 md:gap-x-14">
          {services.map((service, index) => (
            <Link key={service.title} href={service.href} className="group flex gap-5 border-b border-line py-6 sm:py-8">
              <span className="pt-1 text-[10px] tracking-[0.12em] text-bronze">0{index + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-olive-ink sm:text-3xl">{service.title}</h3>
                  <span className="text-lg text-olive-ink transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
                </div>
                <p className="mt-3 max-w-lg text-sm leading-6 text-ink/75">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
