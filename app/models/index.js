

import { Athlete, formatAthlete } from './athlete';
import { Sponsor, formatSponsor } from './sponsor';
import { Sponsorship, formatSponsorship } from './sponsorship';

// Define Associations
Athlete.belongsToMany(Sponsor, { through: Sponsorship, foreignKey: 'athleteId', otherKey: 'sponsorId' });

Sponsor.belongsToMany(Athlete, { through: Sponsorship, foreignKey: 'sponsorId', otherKey: 'athleteId' });

module.exports = {
  Athlete,
  Sponsor,
  Sponsorship,
  formatAthlete,
  formatSponsor,
  formatSponsorship
};