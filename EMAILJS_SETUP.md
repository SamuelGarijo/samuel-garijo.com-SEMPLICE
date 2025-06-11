# EmailJS Setup Guide

Follow these steps to set up email notifications for portfolio requests:

## 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)

## 2. Create Email Service
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail"
4. Click "Connect Account" and authorize with your Gmail (samuelgarijocortes@gmail.com)
5. Give it a name (e.g., "Portfolio Requests")
6. Click "Create Service"
7. Copy the Service ID (looks like: service_xxxxxxx)

## 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Set up the template:

**Subject:**
```
🎨 Portfolio Request from {{from_name}}
```

**Content:**
```
Hey Samuel! Someone wants to see your portfolio!

Name: {{from_name}}
Email: {{from_email}}
Message: {{message}}

---
This request was sent from your portfolio website.
```

4. In the "To Email" field, you can use: {{to_email}} or directly put: samuelgarijocortes@gmail.com
5. Click "Save"
6. Copy the Template ID (looks like: template_xxxxxxx)

## 4. Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your Public Key

## 5. Add to Environment Variables
Add these to your `.env.local` file:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## 6. Test It
1. Restart your dev server: `npm run dev`
2. Go to your homepage
3. Fill out the portfolio request form
4. You should receive an email at samuelgarijocortes@gmail.com

## Email Format
The email you receive will look like:

```
Subject: 🎨 Portfolio Request from John Doe

Hey Samuel! Someone wants to see your portfolio!

Name: John Doe
Email: john@example.com
Message: I'd love to see your full portfolio for a potential project.

---
This request was sent from your portfolio website.
```

## Troubleshooting
- Make sure all environment variables start with `NEXT_PUBLIC_`
- Check EmailJS dashboard for email logs
- Free tier allows 200 emails/month
- Check spam folder if emails don't arrive