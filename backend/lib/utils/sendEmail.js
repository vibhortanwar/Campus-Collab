import nodemailer from "nodemailer";

/**
 * Sends an OTP email to the given address.
 * The transporter is created lazily so that dotenv has already populated
 * process.env by the time this function is called.
 * @param {string} to - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (to, otp) => {
    // Create transporter here (not at module load) so env vars are available
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Campus Collab" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your Campus Collab Sign-Up OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h2 style="color: #123458; margin-bottom: 8px;">Campus Collab</h2>
                <p style="color: #374151; font-size: 15px;">Use the OTP below to verify your email and complete your sign-up.</p>
                <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #123458;">${otp}</span>
                </div>
                <p style="color: #6b7280; font-size: 13px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
                <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export { sendOtpEmail };
