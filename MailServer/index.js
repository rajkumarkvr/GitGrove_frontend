const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database");
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log(transporter.options);
// **1️⃣ Request Password Reset - Generate Token & Send Email**
app.post("/api/auth/request-reset", async (req, res) => {
  const { email } = req.body;
  console.log("email:", email);
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.log("Use not found error" + err);

      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0)
      return res.status(404).json({ error: "Email not found" });

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    console.log(Date.now() + " reset token");
    const expirationTime = new Date(Date.now() + 8.5 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    console.log(expirationTime);

    db.query(
      "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token=?, expires_at=?",
      [email, resetToken, expirationTime, resetToken, expirationTime],
      (err) => {
        if (err) {
          console.log("Error to inserting password resets" + err);

          return res.status(500).json({ error: "Database error" });
        }

        const resetLink = `http://172.17.23.190:3000/auth/main-reset-password/${resetToken}`;
        console.log(resetLink);
        const mailOptions = {
          from: "rajkumar.ce2023@gmail.com",
          to: email,
          subject: "Reset Your Password",
          html: `
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password.</p>
            <p>If you made this request, click the button below to reset your password:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in <b>3 hours</b>. If you didn't request this, ignore this email.</p>
            <p>Thanks,<br>The GitGrove Team</p>
          `,
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.table(err);
            console.log(err);
            return res.status(500).json({ error: "Failed to send email" });
          }
          res.json({ message: "Reset email sent! Check your inbox." });
        });
      }
    );
  });
});

// **2️⃣ Reset Password - Validate Token & Update Password**
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;
  console.log(token);
  console.log(password);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    console.log("Email: " + email);
    db.query(
      "SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()",
      [email, token],
      async (err, results) => {
        if (err) {
          console.log("Error at the checking email: " + err);

          return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0)
          return res.status(400).json({ error: "Invalid or expired token" });

        const hashedPassword = await bcrypt.hash(password, 12);

        db.query(
          "UPDATE users SET password_hash = ? WHERE email = ?",
          [hashedPassword, email],
          (err) => {
            if (err) {
              console.log("Error at the update password" + err);

              return res.status(500).json({ error: "Database error" });
            }

            db.query(
              "DELETE FROM password_resets WHERE email = ?",
              [email],
              (err) => {
                if (err) {
                  console.log("Error at delete password" + err);
                  return res.status(500).json({ error: "Database error" });
                }
                res.json({
                  message: "Password reset successful! You can now log in.",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});

//Request for collaborators

app.post("/api/users/invite-collab", async (req, res) => {
  try {
    const { users, inviter } = req.body;

    if (!users || users.length === 0) {
      return res
        .status(400)
        .json({ error: "No users selected for invitation." });
    }
    console.log(inviter);

    if (
      !inviter ||
      !inviter.username ||
      !inviter.email ||
      !inviter.repositoryName
    ) {
      return res.status(400).json({ error: "Invalid inviter details." });
    }

    const emailPromises = users.map((user) => {
      const inviteLink = `http://172.17.23.190:3000/auth/collaboration-invite?inviterUsername=${encodeURIComponent(
        inviter.username
      )}&inviterAvatar=${encodeURIComponent(
        inviter.avator
      )}&inviteeUsername=${encodeURIComponent(
        user.username
      )}&inviteeAvatar=${encodeURIComponent(
        user.avatar
      )}&repo=${encodeURIComponent(inviter.repositoryName)}`;

      const mailOptions = {
        from: `"${inviter.username} (GitGrove)" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `GitGrove Collaboration Invite from ${inviter.username}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 10px; border: 1px solid #ddd; max-width: 500px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">You're Invited to Collaborate! 🚀</h2>
            <p>Dear <strong>${user.username}</strong>,</p>
            <p><strong>${inviter.username}</strong> has invited you to collaborate on the repository "<strong>${inviter.repositoryName}</strong>" on GitGrove.</p>
            <div style="text-align: center;">
              <img src="${inviter.avator}" alt="${inviter.username}" style="border-radius: 50%; width: 70px; height: 70px; margin-bottom: 10px;">
              <p style="font-size: 14px; color: #555;">From: <strong>${inviter.username}</strong></p>
            </div>
            <p style="text-align: center; margin: 20px 0;">
              <a href="${inviteLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Accept Invitation</a>
            </p>
            <p>If you did not expect this invitation, you can ignore this email.</p>
            <p style="font-size: 12px; color: #777; text-align: center;">GitGrove - Empowering Open Source Collaboration</p>
          </div>
        `,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    res.json({ message: "Successfully invited all selected users." });
  } catch (error) {
    console.error("Error sending invitation emails:", error);
    res
      .status(500)
      .json({ error: "Failed to send invitations. Please try again." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
