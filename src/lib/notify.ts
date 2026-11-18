export async function notifyNewEnquiry(e: {
  name: string;
  phone: string;
  email?: string | null;
  message: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM ?? "onboarding@resend.dev",
        to: [to],
        subject: `New enquiry from ${e.name}`,
        text: `Name: ${e.name}\nPhone: ${e.phone}\nEmail: ${e.email ?? "-"}\n\n${e.message}`,
      }),
    });
  } catch (error) {
    console.error("notify_failed", error);
  }
}