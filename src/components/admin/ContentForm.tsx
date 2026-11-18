"use client";

import { useActionState, useState } from "react";
import { savePageContent } from "@/server/content-actions";
import type { FormState } from "@/server/content-actions";
import type { SelfDriveContent } from "@/lib/content";

export function ContentForm({ content }: { content: SelfDriveContent }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(savePageContent, undefined);
  const [requirements, setRequirements] = useState<string[]>(content.requirements);
  const [faq, setFaq] = useState(content.faq);

  function addRequirement() { setRequirements((r) => [...r, ""]); }
  function removeRequirement(i: number) { setRequirements((r) => r.filter((_, j) => j !== i)); }
  function updateRequirement(i: number, v: string) {
    setRequirements((r) => r.map((x, j) => (j === i ? v : x)));
  }

  function addFaq() { setFaq((f) => [...f, { question: "", answer: "" }]); }
  function removeFaq(i: number) { setFaq((f) => f.filter((_, j) => j !== i)); }
  function updateFaq(i: number, field: "question" | "answer", v: string) {
    setFaq((f) => f.map((x, j) => (j === i ? { ...x, [field]: v } : x)));
  }

  const inp = "w-full bg-charcoal-700 border border-charcoal-600 text-cream text-sm rounded-lg px-3 py-2.5 focus:border-gold focus:outline-none";
  const lbl = "block text-xs text-muted mb-1.5";

  function wrappedAction(formData: FormData) {
    formData.set("key", "self-drive");
    // Send as single JSON strings (content-actions parses them this way)
    formData.set("requirements", JSON.stringify(requirements.filter(Boolean)));
    formData.set("faq", JSON.stringify(faq.filter((f) => f.question && f.answer)));
    formAction(formData);
  }

  return (
    <form action={wrappedAction} className="space-y-8 max-w-2xl">
      {state?.error && (
        <div className="bg-red-900/40 border border-red-700/50 text-red-400 text-sm rounded-lg px-4 py-3">{state.error}</div>
      )}
      {state?.ok && (
        <div className="bg-green-900/40 border border-green-700/50 text-green-400 text-sm rounded-lg px-4 py-3">Content saved.</div>
      )}

      <div>
        <label htmlFor="cf-title" className={lbl}>Page title</label>
        <input id="cf-title" name="title" required defaultValue={content.title} className={inp} />
      </div>
      <div>
        <label htmlFor="cf-intro" className={lbl}>Intro paragraph(s)</label>
        <textarea id="cf-intro" name="intro" rows={5} required defaultValue={content.intro} className={`${inp} resize-y`} />
      </div>

      {/* Requirements */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-cream">Requirements</h3>
          <button type="button" onClick={addRequirement} className="text-xs text-gold hover:underline">+ Add</button>
        </div>
        <div className="space-y-2">
          {requirements.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={r}
                onChange={(e) => updateRequirement(i, e.target.value)}
                name={`__req_${i}`}
                className={`${inp} flex-1`}
              />
              <button type="button" onClick={() => removeRequirement(i)} className="text-red-400 hover:text-red-300 text-sm px-2">✕</button>
            </div>
          ))}
        </div>
      </section>

      <div>
        <label htmlFor="cf-foreign" className={lbl}>For foreign visitors</label>
        <textarea id="cf-foreign" name="foreignNotes" rows={4} required defaultValue={content.foreignNotes} className={`${inp} resize-y`} />
      </div>
      <div>
        <label htmlFor="cf-pricing" className={lbl}>Pricing notes</label>
        <textarea id="cf-pricing" name="pricingNotes" rows={4} required defaultValue={content.pricingNotes} className={`${inp} resize-y`} />
      </div>
      <div>
        <label htmlFor="cf-insurance" className={lbl}>Insurance notes</label>
        <textarea id="cf-insurance" name="insuranceNotes" rows={4} required defaultValue={content.insuranceNotes} className={`${inp} resize-y`} />
      </div>
      <div>
        <label htmlFor="cf-pickup" className={lbl}>Pickup &amp; drop-off info</label>
        <textarea id="cf-pickup" name="pickupInfo" rows={4} required defaultValue={content.pickupInfo} className={`${inp} resize-y`} />
      </div>

      {/* FAQ */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-cream">FAQ</h3>
          <button type="button" onClick={addFaq} className="text-xs text-gold hover:underline">+ Add question</button>
        </div>
        <div className="space-y-5">
          {faq.map((item, i) => (
            <div key={i} className="bg-charcoal-800 border border-charcoal-700 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <label className={lbl}>Question</label>
                <button type="button" onClick={() => removeFaq(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
              </div>
              <input value={item.question} onChange={(e) => updateFaq(i, "question", e.target.value)} className={inp} />
              <label className={lbl}>Answer</label>
              <textarea value={item.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={3} className={`${inp} resize-y`} />
            </div>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="bg-gold text-charcoal font-semibold px-8 py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-60 text-sm"
      >
        {pending ? "Saving…" : "Save Content"}
      </button>
    </form>
  );
}
