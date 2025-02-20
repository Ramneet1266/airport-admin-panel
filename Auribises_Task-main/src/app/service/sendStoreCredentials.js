import nodemailer from "nodemailer";

export const sendStoreCredentials = async (storeHeadEmail, storeEmail, storePassword) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: storeHeadEmail,
            subject: "Your Store Credentials",
            html: `
                <h2>Welcome to Our Store Management System</h2>
                <p>Dear Store Head,</p>
                <p>Your store account has been created successfully. Below are your credentials:</p>
                <ul>
                    <li><b>Email:</b> ${storeEmail}</li>
                    <li><b>Password:</b> ${storePassword}</li>
                </ul>
                <p>Please keep these credentials secure.</p>
                <p>Best Regards,</p>
                <p><b>Store Management Team</b></p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return { success: false, message: "Error sending email" };
    }
};
