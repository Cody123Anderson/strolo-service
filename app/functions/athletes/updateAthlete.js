import { success, serverFailure, failure } from '../../utils/response';
import { getCurrentTimestamp } from '../../utils/time';
import { formatAthlete } from '../../utils/athlete';
import { isLambdaWarmer } from '../../utils/warmer';
import { requireAuth } from '../../utils/auth';
import * as constants from '../../constants';
import Athlete from '../../models/athlete';

export async function main(event) {
  return new Promise(async (resolve, reject) => {
    if (isLambdaWarmer(event)) return resolve(success());

    const { athleteId } = event.pathParameters;
    let existingAthlete;

    event.body = JSON.parse(event.body);

    await requireAuth(event, reject, constants.JWT.TYPES.ATHLETE);

    const datetime = getCurrentTimestamp();
    const newAttributes = {
      ...formatAthlete(event.body),
      updatedAt: `${datetime}`
    };

    // don't let the athlete update their password using this endpoint
    delete newAttributes.password;

    console.info('athleteId: ', athleteId);
    console.info('newAttributes: ', newAttributes);

    try {
      existingAthlete = await Athlete.findOne({ where: { athleteId } });
    } catch (e) {
      console.error('server error finding the athlete: ', e);
      reject(serverFailure('Server error finding the athlete', e));
    }

    if (existingAthlete) {
      try {
        existingAthlete.update(newAttributes);

        const newAthlete = { ...existingAthlete.dataValues, ...newAttributes };
        
        delete newAthlete.password;

        console.info('newAthlete: ', newAthlete);
    
        resolve(success({ status: 'athlete updated successfully', athlete: newAthlete }));
      } catch (e) {
        console.error('server error updating the athlete: ', e);
        reject(serverFailure('Server error updating the athlete', e));
      }
    } else {
      reject(failure(404, 'No athlete with this ID exists'));
    }
  });
}
