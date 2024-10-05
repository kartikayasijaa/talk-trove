import { MailtrapClient } from './mailtrap.config.js';
import { sender } from './mailtrap.config.js';
import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE
} from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    const mailOptions = {
        from: sender.from,
        to: email,
        subject: 'Email Verification',
        html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
        category: "Email Verification"
    };

    try {
        const info = await MailtrapClient.sendMail(mailOptions);
        console.log('Message sent: Email Send Successfully %s', info.messageId);
    } catch (error) {
        console.log('Error sending Verification email', error.message);
        throw new Error(`Error sending Verification email:${error}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: sender.from,
        to: email,
        subject: 'Welcome to our platform',
        text: `Hello ${name}, Welcome to our platform`,
        html: WELCOME_EMAIL_TEMPLATE.replace('{name}', name),
        category: "Welcome Email"
    };

    try {
        const info = await MailtrapClient.sendMail(mailOptions);
        console.log('Message sent: Email Send Successfully %s', info.messageId);
    } catch (error) {
        console.log('Error sending Welcome email', error.message);
        throw new Error(`Error sending Welcome email:${error}`);
    }
};

export const login = async (req, res) => {
    res.send("Login Route");
}

export const sendResetPasswordResetEmail = async ({ email, resetURL }) => {
    const mailOptions = {
        from: sender.from,
        to: email,
        subject: 'Reset Password',
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
        category: "Reset Password"
    };

    try {
        const info = await MailtrapClient.sendMail(mailOptions);
        console.log('Message sent: Email Send Successfully %s', info.messageId);
    } catch (error) {
        console.log('Error sending Reset Password email', error.message);
        throw new Error(`Error sending Reset Password email: ${error}`);
    }
};