import fs from 'fs';
import Handlebars from 'handlebars';
import { notEmptyArray } from './utils';
import { Logger } from '@helpers/Logger';

interface DummyDataProps {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  unsubscribeUrl: string;
}

Handlebars.registerHelper('notEmptyArray', notEmptyArray);

export const NotificationsService = {
  /**
   * Previews an email template with dummy data
   *
   * @param id
   */
  previewEmailTemplate(id: string): any {
    const baseDir = __dirname.toString() === '/' ? './dist/modules/notifications' : __dirname;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const source = fs.readFileSync(`${baseDir}/email-templates/${id}.html`, 'utf-8');

    let html;

    try {
      const data: Partial<DummyDataProps> = {
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Kilian Doe',
        email: 'john@example.com',
        unsubscribeUrl: `${process.env.API_BASE_URL}/notifications/email/unsubscribe?email=john@example.com`,
      };

      html = Handlebars.compile(source)(data);
    } catch (err) {
      Logger.Error('Email compilation failed: ', err.message, err.stack);
      return 'An error occurred while compiling template';
    }

    return html;
  },
};
