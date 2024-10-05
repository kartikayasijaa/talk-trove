import nodemailer from 'nodemailer';

// Create a transporter object using your email service
export const MailtrapClient = nodemailer.createTransport({
    service: 'gmail', // or any other service like 'yahoo', 'outlook', etc.
    auth: {
        user: '', // your email address Generally to send mail it will be costly so u can add you gmail in gmail setting u can accept to send mail to any one and generate password
        pass: ' '    // your email password
    }
});

// Define email options
export const sender = {
    from: '## your mail from where the mail need to be send',  // sender address
    to: '### to who we can add by code in back end by calling verify mail',   // list of receivers
    subject: 'Hello ✔',            // Subject line
    text: 'Hello world?',           // plain text body
    html: '<b>Hello worlced?</b>'     // HTML body
};

// Send email
MailtrapClient.sendMail(sender, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
