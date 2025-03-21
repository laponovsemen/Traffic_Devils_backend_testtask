import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.GMAIL_HOST,
            port: Number(process.env.GMAIL_PORT), // Порт должен быть числовым значением
            auth: {
                user: process.env.GMAIL_APP_ADRESS,
                pass: process.env.GMAIL_APP_PASSWORD,
            }
        });
    }

    async sendActivationMail(to: string, code: string): Promise<void> {
        const link = `${process.env.API_URL}/api/registration-confirmation/${code}`;
        await this.transporter.sendMail({
            from: process.env.GMAIL_APP_ADRESS,
            to,
            subject: `Account activation on ${process.env.API_URL}`,
            html: `
                <div>
                    For account activation proceed on <a href="${link}">${link}</a>
                </div>
            `,
        });
    }
}

export const mailService = new MailService();
