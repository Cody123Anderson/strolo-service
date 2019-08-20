import { Activity, formatActivity } from './activity';
import { ActivityType, formatActivityType } from './activityType';
import { Athlete, formatAthlete } from './athlete';
import { Sponsor, formatSponsor } from './sponsor';
import { Sponsorship, formatSponsorship } from './sponsorship';

// Define Associations
Activity.belongsTo(ActivityType, { as: 'activityType', foreignKey: 'activityTypeId' });

Athlete.belongsToMany(Sponsor, { through: Sponsorship, foreignKey: 'athleteId', otherKey: 'sponsorId' });

Sponsor.belongsToMany(Athlete, { through: Sponsorship, foreignKey: 'sponsorId', otherKey: 'athleteId' });

module.exports = {
  Activity,
  ActivityType,
  Athlete,
  Sponsor,
  Sponsorship,
  formatActivity,
  formatActivityType,
  formatAthlete,
  formatSponsor,
  formatSponsorship
};