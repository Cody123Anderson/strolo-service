import { pickBy, identity } from 'lodash';

import { success, failure, serverFailure } from '../../utils/response';
import { sendgrid } from '../../services/sendgrid';

export async function main(event) {
  return new Promise(async (resolve) => {
    console.info('EVENT RECEIVED: ', event);

    for (const record of event.Records) {
      const data = JSON.parse(record.Sns.Message);

      console.info('data: ', data);

      if (!data.to || !data.from || !data.sendgridTemplateId) {
        return resolve(failure(400, 'missing required params'));
      }

      const email = pickBy(
        {
          to: data.to,
          from: data.from,
          templateId: data.sendgridTemplateId,
          dynamic_template_data: data.templateData
        },
        identity
      );

      console.info('email: ', email);

      try {
        await sendgrid.send(email);

        return resolve(success({ status: 'email sent successfully' }));
      } catch (err) {
        console.error('server error sending email: ', err);
        resolve(serverFailure('server error sending email: ', err));
      }
    }
  });
}
