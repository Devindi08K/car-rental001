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
    <section className="section-pad bg-[#eae7df]" aria-labelledby="why-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[1fr_0.65fr] md:items-end">
          <div>
            <p className="eyebrow mb-4">The difference</p>
            <h2 id="why-heading" className="editorial-heading text-ink">
              {BUSINESS_NAME}, with you all the way.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink/75">
            Thoughtful details, dependable service and the freedom to discover Sri Lanka at your own pace.
          </p>
        </div>
        <div className="grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <article key={reason.title} className="border-b border-ink/15 py-6 sm:px-5 sm:py-8 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0">
              <p className="mb-9 text-xs tracking-[0.14em] text-bronze">{reason.num}</p>
              <h3 className="font-display text-2xl text-ink">{reason.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/75">{reason.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
