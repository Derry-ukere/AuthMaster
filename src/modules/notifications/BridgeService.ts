// Notifications service bridge
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { createTransport } from 'nodemailer';
import Bluebird from 'bluebird';
import { Logger } from '@helpers/Logger';
import { StatusDto } from '@typings/index';
import emailConfig from '../../postmark';

const Mailer = createTransport(emailConfig);

const defaultSender = '"DistinctAI " <noreply@distinct.ai>';

type EmailAddressDto = {
  name?: string;
  email: string;
};

type SendMailDto = {
  subject?: string;
  content?: string;
  template?: {
    id?: string;
    params?: any;
  };
  sender: EmailAddressDto;
  receivers: EmailAddressDto[];
  cc?: EmailAddressDto[];
  bcc?: EmailAddressDto[];
};

export const NotificationsBridgeService = {
  async sendNotification(): Promise<StatusDto> {
    return {
      success: true,
    };
  },
  async sendEmail(request: Partial<SendMailDto>): Promise<StatusDto & { data: { accepted: number; failed: number } }> {
    const { subject, template, content, receivers = [], sender } = request;

    let accepted = 0;
    let failed = 0;

    await Bluebird.Promise.map(receivers, async receiver => {
      let html = '';
      const text = content;

      if (template) {
        const baseDir = __dirname.toString() === '/' ? './dist/modules/notifications' : __dirname;
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const source = fs.readFileSync(path.join(`${baseDir}/email-templates/${template.id}.html`), 'utf-8');
        html = Handlebars.compile(source)({
          ...(template.params || {}),
          recipientEmail: receiver.email,
          unsubscribeUrl: `${process.env.API_BASE_URL}/notifications/email/unsubscribe?email=${receiver.email}`,
        });
      }

      const { name, email } = receiver;

      Logger.Info(`Sending an email to ${email}`);

      try {
        const status = await Mailer.sendMail({
          subject,
          from: sender ? `"${sender.name || 'DistinctAI'} " <${sender.email || 'noreply@distinct.ai'}>` : defaultSender,
          to: name ? { name, address: email } : email,
          html,
          text,
        });

        accepted += 1;

        Logger.Info(`Email sent to ${email} with message-d: ${status.messageId}`);
      } catch (err) {
        failed += 1;
        Logger.Info(`Error sending email to ${email}`, err.message, err.stack);
      }
    });

    return {
      success: true,
      message: `Request completed with ${accepted} accepted and ${failed} failed.`,
      data: {
        accepted,
        failed,
      },
    };
  },
};
