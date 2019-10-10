import axios from 'axios';

import { SponsorActivity, Sponsorship } from '../../models';
import { serverFailure, failure, success } from '../../utils/response';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    console.info('EVENT RECEIVED: ', event);

    for (const record of event.Records) {
      const { activity } = JSON.parse(record.Sns.Message);
      const { activityId, athleteId } = activity;
      let sponsorships = [];
      
      // Get all active sponsorships for this athlete
      try {
        sponsorships = await Sponsorship.findAll({
          where: { athleteId }
        });
      } catch (e) {
        console.error('server error getting athlete sponsorships: ', e);
        reject(serverFailure('server error getting athlete sponsorships: ', e));
      }

      // For each sponsorship, create a sponsor activity
      for (const sponsorship of sponsorships) {
        console.log('sponsorship.sponsorId: ', sponsorship.sponsorId);

        // Need to check if this sponsorActivity already exists
        const sponsorActivity = await SponsorActivity.findOne({
          where: {
            activityId,
            sponsorId: sponsorship.sponsorId
          }
        });

        console.log('sponsorActivity: ', sponsorActivity);
        // It doesn't exist, now create it
      }

      // Install the latest XP script tag
      // if (!hasXPScriptTag) {
      //   try {
      //     const scriptTagPostBody = {
      //       script_tag: { event: 'onload', src: xpScriptUrl }
      //     };

      //     const shopScriptResponse = await axios.post(`${adminUrl}/script_tags.json`, scriptTagPostBody, shopRequestOptions);

      //     console.info('shopScriptResponse.data: ', shopScriptResponse.data);
      //   } catch (e) {
      //     console.error('Error posting xp script tag: ', JSON.stringify(e.response));
      //     return reject(failure(400, 'Error posting xp script tag: ', e.response));
      //   }
      // }
    }

    resolve(success({ status: 'Sponsor activities created successfully!' }));
  });
}
