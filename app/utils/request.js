import { SERENADE_SERVICE_API_KEY } from '../constants';

export function getInternalRequestOptions() {
  return {
    headers: {
      'Serenade-Service-API-Key': SERENADE_SERVICE_API_KEY
    }
  };
}
