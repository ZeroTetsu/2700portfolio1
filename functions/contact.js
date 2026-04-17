export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const message = formData.get("message")?.trim();

    if (!name || !email || !message) {
      return new Response("Missing fields.", { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response("Invalid email.", { status: 400 });
    }

    // Replace with your email API (SendGrid, Mailgun, Postmark, etc.)
    // Example: SendGrid API call
    const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
    const CONTACT_EMAIL = context.env.CONTACT_EMAIL || "aanthonyjenrick456@gmail.com";

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: CONTACT_EMAIL }] }],
        from: { email },
        subject: "New Contact Form Message",
        content: [{ type: "text/plain", value: `From: ${name}\nEmail: ${email}\n\n${message}` }]
      })
    });

    if (!res.ok) {
      return new Response("Error sending message.", { status: 500 });
    }

    return new Response("Message sent.", { status: 200 });
  } catch (err) {
    return new Response("Server error.", { status: 500 });
  }
}
