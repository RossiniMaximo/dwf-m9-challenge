import { sgMail } from "lib/connections/sendgrid";

export async function sendEmail(to, subject, text) {
  const msg = {
    to: to,
    from: "maximorossini2016@gmail.com",
    subject: subject,
    text: text,
    html: `<div>${text}</div>`,
  };
  const send = sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
  if (send) {
    return true;
  }
}
