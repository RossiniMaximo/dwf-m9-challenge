import SibApiV3Sdk from "sib-api-v3-sdk";
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.SENDINBLUE_API_KEY;

export async function sendAuthEmail(body) {
  console.log("entre");

  const result =
    await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
      sender: { email: "maximorossini2016@gmail.com", name: "Maximo" },
      subject: "Authorization code",
      htmlContent:
        "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
      params: {
        greeting: "This is the default greeting",
        headline: "This is the default headline",
      },
      messageVersions: [
        {
          to: [
            {
              email: body.email,
              name: body.fullname,
            },
          ],
          htmlContent: ` <!DOCTYPE html><html><body><h1>¡Authorization!</h1><p>Your code is : ${body.code} , it expires at : ${body.expiration}</p></body></html>`,
          subject: "¡Thank you for signing in!",
        },
      ],
    });
  return result;
}
export async function sendPurchaseEmail(body) {
  const result =
    await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
      sender: { email: "maximorossini2016@gmail.com", name: "Maximo" },
      subject: "Authorization code",
      htmlContent:
        "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
      params: {
        greeting: "This is the default greeting",
        headline: "This is the default headline",
      },
      messageVersions: [
        {
          to: [
            {
              email: body.email,
              name: body.fullname,
            },
          ],
          htmlContent: ` <!DOCTYPE html><html><body><h1>¡New Purchase!</h1><p>You have purchased an ${body.name}</p></body></html>`,
          subject: "¡Thanks for buying!",
        },
      ],
    });
  return result;
}
