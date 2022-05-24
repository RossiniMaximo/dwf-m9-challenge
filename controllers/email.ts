import { sgMail } from "lib/connections/sendgrid";

export async function sendEmail(to) {
  const msg = {
    to: to,
    from: "maximorossini2016@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
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
