import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { whatsappLink, telHref } from "@/lib/format";
import { BUSINESS_NAME } from "@/lib/constants";
import { EnquiryForm } from "@/components/contact/EnquiryForm";

export const metadata: Metadata = pageMeta({
  title: "Contact Us",
  description: `Get in touch with ${BUSINESS_NAME}. Phone, WhatsApp, email, or enquiry form. We reply as soon as we can.`,
  path: "/contact",
});


export default async function ContactPage() {
  const settings = await getSettings();
  const wa = whatsappLink(settings.whatsappNumber);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="bg-beige/30 py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <p className="eyebrow mb-4">We’re here to help</p>
          <h1 className="editorial-heading text-ink">Let’s plan your journey.</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-ink/75">
            Questions, plans or a special request? Our team is happy to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="mb-7 font-display text-3xl text-ink">Reach us directly</h2>
            <ul className="divide-y divide-line border-y border-line">
              <li className="flex items-start gap-4 py-5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-olive-ink">
                  <svg className="w-4 h-4 text-olive-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.13em] text-ink/70">Phone</p>
                  <a href={telHref(settings.phone)} className="font-medium text-ink transition-colors hover:text-olive-ink">{settings.phone}</a>
                </div>
              </li>
              {wa && (
                <li className="flex items-start gap-4 py-5">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-olive-ink">
                    <svg className="w-4 h-4 text-olive-ink" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.13em] text-ink/70">WhatsApp</p>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="font-medium text-ink transition-colors hover:text-olive-ink">Message us on WhatsApp</a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-4 py-5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-olive-ink">
                  <svg className="w-4 h-4 text-olive-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.13em] text-ink/70">Email</p>
                  <a href={`mailto:${settings.email}`} className="font-medium text-ink transition-colors hover:text-olive-ink">{settings.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-4 py-5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-olive-ink">
                  <svg className="w-4 h-4 text-olive-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.13em] text-ink/70">Address</p>
                  <p className="font-medium text-ink">{settings.address}</p>
                  <p className="mt-1 text-sm text-ink/75">{settings.openingHours}</p>
                </div>
              </li>
            </ul>

            {(settings.instagramUrl || settings.tiktokUrl || settings.facebookUrl) && (
              <div className="mt-9">
                <h2 className="mb-4 font-display text-2xl text-ink">Follow along</h2>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    { label: "Instagram", url: settings.instagramUrl },
                    { label: "TikTok", url: settings.tiktokUrl },
                    { label: "Facebook", url: settings.facebookUrl },
                  ].filter((social) => social.url).map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex border-b border-line py-2 text-sm text-ink transition-colors hover:border-olive hover:text-olive-ink"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map embed */}
            {settings.mapEmbedUrl && (
              <div className="mt-10 h-64 overflow-hidden bg-beige/30">
                <iframe
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map"
                />
              </div>
            )}
          </div>

          <div>
            <div className="bg-paper p-6 sm:p-9">
              <p className="eyebrow mb-3">Send a message</p>
              <h2 className="mb-8 font-display text-3xl text-ink">How can we help?</h2>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
