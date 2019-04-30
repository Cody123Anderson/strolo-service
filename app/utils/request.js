import { XP_SERVICE_API_KEY } from '../constants';

export function getInternalRequestOptions() {
  return {
    headers: {
      'XP-Service-API-Key': XP_SERVICE_API_KEY
    }
  };
}
