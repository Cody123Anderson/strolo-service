import { Activity, formatActivity } from './activity';
import { ActivityType, formatActivityType } from './activityType';
import { Athlete, formatAthlete } from './athlete';
import { StroloClass, formatStroloClass } from './stroloClass';
import { Sponsor, formatSponsor } from './sponsor';
import { Sponsorship, formatSponsorship } from './sponsorship';

// Define Associations
Activity.belongsTo(ActivityType, { as: 'activityType', foreignKey: 'activityTypeId' });

Athlete.belongsToMany(Sponsor, { as: 'sponsorships', through: Sponsorship, foreignKey: 'athleteId', otherKey: 'sponsorId' });

Sponsor.belongsToMany(Athlete, { through: Sponsorship, foreignKey: 'sponsorId', otherKey: 'athleteId' });

StroloClass.belongsTo(ActivityType, { as: 'activityType', foreignKey: 'activityTypeId' });

module.exports = {
  Activity,
  ActivityType,
  Athlete,
  Sponsor,
  Sponsorship,
  StroloClass,
  formatActivity,
  formatActivityType,
  formatAthlete,
  formatSponsor,
  formatSponsorship,
  formatStroloClass
};