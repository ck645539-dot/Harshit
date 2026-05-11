import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Order Confirmation
  app.post("/api/confirm-order", async (req, res) => {
    const { order, customerEmail } = req.body;

    if (!order || !customerEmail) {
      return res.status(400).json({ error: "Missing order or email" });
    }

    // Lazy initialization of transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const itemsHtml = order.items
      .map(
        (item: any) => `<li><strong>\${item.quantity}x \${item.name}</strong> - ₹\${item.price} (\${item.category})</li>`
      )
      .join("");

    const mailOptions = {
      from: `"The Nawaabs" <\${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order Confirmed - #\${order.id} | The Nawaabs`,
      html: `
        <div style="font-family: 'Playfair Display', serif; background-color: #F9F7F2; padding: 40px; color: #1F1F1F;">
          <h1 style="color: #C5A059; border-bottom: 2px solid #C5A059; padding-bottom: 20px;">Order Confirmed!</h1>
          <p>Greetings from <strong>The Nawaabs</strong>,</p>
          <p>Your royal feast is being prepared by our master chefs. Here are your order details:</p>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #C5A059; margin: 20px 0;">
            <p><strong>Order ID:</strong> \${order.id}</p>
            <p><strong>Date:</strong> \${order.date}</p>
            <ul>\${itemsHtml}</ul>
            <p style="font-size: 20px; font-weight: bold; color: #C5A059;">Total Paid: ₹\${order.total}</p>
          </div>

          <p><strong>Estimated Delivery Time:</strong> 45 - 60 Minutes</p>
          <p>Thank you for choosing legacy. Thank you for choosing The Nawaabs.</p>
          <br>
          <p style="font-size: 12px; color: #888;">12/A, Heritage Mile, Civil Lines, Agra, Uttar Pradesh</p>
        </div>
      `,
    };

    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials missing. Order logged but email not sent.");
        return res.json({ success: true, message: "Order confirmed (Email skipped: Credentials missing)" });
      }

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Confirmation email sent" });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:\${PORT}`);
  });
}

startServer();
