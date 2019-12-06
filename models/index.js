import { Activity, formatActivity } from './activity';
import { ActivityType, formatActivityType } from './activityType';
import { Athlete, formatAthlete } from './athlete';
import { StroloClass, formatStroloClass } from './stroloClass';
import { Sponsor, formatSponsor } from './sponsor';
import { SponsorActivity, formatSponsorActivity } from './sponsorActivity';
import { Sponsorship, formatSponsorship } from './sponsorship';

// Define Associations
Activity.belongsTo(ActivityType, { as: 'activityType', foreignKey: 'activityTypeId' });
Activity.belongsToMany(Sponsor, { as: 'sponsorActivities', through: SponsorActivity, foreignKey: 'activityId', otherKey: 'sponsorId' });

Athlete.belongsToMany(Sponsor, { as: 'sponsorships', through: Sponsorship, foreignKey: 'athleteId', otherKey: 'sponsorId' });

Sponsor.belongsToMany(Athlete, { through: Sponsorship, foreignKey: 'sponsorId', otherKey: 'athleteId' });
Sponsor.belongsToMany(Activity, { through: SponsorActivity, foreignKey: 'sponsorId', otherKey: 'activityId' });

StroloClass.belongsTo(ActivityType, { as: 'activityType', foreignKey: 'activityTypeId' });

module.exports = {
  Activity,
  ActivityType,
  Athlete,
  Sponsor,
  SponsorActivity,
  Sponsorship,
  StroloClass,
  formatActivity,
  formatActivityType,
  formatAthlete,
  formatSponsor,
  formatSponsorActivity,
  formatSponsorship,
  formatStroloClass
};