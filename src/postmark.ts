/// <reference types="./@types/nodemailer-postmark-transport" />

import postmarkTransport from 'nodemailer-postmark-transport';

export default postmarkTransport({
  auth: {
    apiKey: process.env.POSTMARK_API_KEY || '_postmarkapp-key',
  },
});
