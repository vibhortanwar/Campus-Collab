/**
 * Sends an OTP email to the given address using the Resend HTTP API.
 * @param {string} to - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
const sendOtpEmail = async (to, otp) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error("RESEND_API_KEY is missing from environment variables.");
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            from: "Campus Collab <onboarding@resend.dev>",
            to: [to],
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
            `
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to send email via Resend. Status: ${response.status}`);
    }
};

export { sendOtpEmail };

