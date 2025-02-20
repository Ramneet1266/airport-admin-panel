"use server"; // Ensures this runs only on the server

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { toEmail, storeEmail, storePassword } = await req.json();

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "auribisesproject@gmail.com", // Replace with your email
                pass: "ukqa fmcm duvp zphr", // Use an App Password from Google
            },
        });

        let mailOptions = {
            from: "auribisesproject@gmail.com",
            to: toEmail,
            subject: "Your Account Details",
            text: `Dear User,

Your account has been successfully created. Below are your login credentials:

- **Email:** ${storeEmail}
- **Password:** ${storePassword}

Please keep this information secure.

Best Regards,`
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
    }
}
