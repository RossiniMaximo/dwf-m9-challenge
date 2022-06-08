import { sgMail } from "lib/connections/sendgrid";

export async function sendEmail(to, subject, text) {
  const msg = {
    to: to,
    from: "maximorossini2016@gmail.com",
    subject: subject,
    text: text,
    html: `<div>${text}</div>`,
  };
  const send = sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  if (send) {
    return true;
  }
}
