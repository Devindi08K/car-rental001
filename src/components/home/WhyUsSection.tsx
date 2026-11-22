import { BUSINESS_NAME } from "@/lib/constants";

const reasons = [
  {
    num: "01",
    title: "Premium Fleet",
    desc: "From economy to ultra-luxury — meticulously maintained and regularly serviced for your safety and comfort.",
  },
  {
    num: "02",
    title: "Transparent Pricing",
    desc: "Clear daily rates in LKR. Fuel, deposit and distance allowance are confirmed before you book.",
  },
  {
    num: "03",
    title: "Fast Support",
    desc: "WhatsApp and phone support during opening hours, with quick replies to every enquiry.",
  },
  {
    num: "04",
    title: "Island-Wide Service",
    desc: "Airport pickups, Colombo city drives, upcountry tours — we cover all of Sri Lanka.",
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 md:py-28 bg-charcoal-800" aria-labelledby="why-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">Why Us</p>
          <h2 id="why-heading" className="font-display text-4xl md:text-5xl font-bold text-cream">
            The {BUSINESS_NAME} Difference
          </h2>
          <span className="block w-12 h-0.5 bg-gold mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r) => (
            <div key={r.title} className="text-center">
              <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="font-display text-gold text-lg font-bold">{r.num}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-cream mb-2">{r.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
