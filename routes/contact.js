const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: 'You are being rate-limited. You can only send the form once per minute.',
    standardHeaders: true,
    legacyHeaders: false,
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `"Vyplnění formuláře" <website@pedrex.sbs>`,
    to: 'pedrexik@gmail.com',
    subject: `Někdo vyplnil formulář na pedrex.sbs!`,
    html: `
    <p>Na <a href="https://pedrex.sbs/">https://pedrex.sbs/</a> došlo k novému vyplnění formuláře.</p>
    <p>
        <strong>Jméno:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Zpráva:</strong><br>${message}
    </p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    req.session.formSent = true;
    res.redirect('/');
  } catch (err) {
    console.error('Email sending error:', err);
    res.redirect('/?error=1');
  }
});

module.exports = router;
