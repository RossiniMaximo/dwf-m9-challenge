import { sgMail } from "lib/connections/sendgrid";

export async function sendEmail(to, subject, text) {
  const msg = {
    to: to,
    from: "maximorossini2016@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: text,
    html: "<strong>${subject}</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
