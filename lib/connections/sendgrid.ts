import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_KEY);
export { sgMail };

export async function sendAuthMail(email: string, code: number, expiration) {
  const msg = {
    to: email,
    from: "maximorossini2016@gmail.com",
    subject: "Authorization",
    text: "text",
    html: `<div><h3>
        Your code is : ${code} it expires at : ${expiration}
    </h3>
    </div>`,
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
export async function purchaseAlertMail(email: string) {
  const msg = {
    to: email,
    from: "maximorossini2016@gmail.com",
    subject: "Purchase",
    text: "text",
    html: `<div><h3>
        You have just bought an item!
    </h3>
    </div>`,
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
