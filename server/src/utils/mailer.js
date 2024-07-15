const { EmailClient } = require("@azure/communication-email");
const { COMMUNICATION_SERVICE_CONNECTION_STRING } = require("../configs");


const client = new EmailClient(COMMUNICATION_SERVICE_CONNECTION_STRING);

const getSignUpEmail = (email) => {
    return {
        senderAddress: "<DoNotReply@azizjb.tn>",
        content: {
          subject: "Welcome to Shortly.tn",
          plainText: "Thank you for signing up to Shortly.tn",
          html: "<html><body><h1>Welcome to Shortly.tn</h1><p>Thank you for signing up to Shortly.tn</p></body></html>",
        },
        recipients: {
          to: [
            {
              address: "<"+email+">",
            },
          ],
        },
    };
}

const getVerificationEmail = (email, token) => {
    return {
        senderAddress: "<DoNotReply@azizjb.tn>",
        content: {
          subject: "Email Verification",
          plainText: "Click here to verify your email",
          html: `<html><body><h1>Email Verification</h1><p>Click <a href="${process.env.CLIENT_URL}/auth/verify?token=${token}">here</a> to verify your email</p></body></html>`,
        },
        recipients: {
          to: [
            {
              address: "<"+email+">",
            },
          ],
        },
    };
}

module.exports = {
    client,
    getSignUpEmail,
    getVerificationEmail
};