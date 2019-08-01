import { cleanObj } from './format-data';

export function formatAthlete(athlete) {
  const formattedAthlete = {
    athleteId: athlete.athleteId,
    firstName: athlete.firstName,
    lastName: athlete.lastName,
    profileImageUrl: athlete.profileImageUrl,
    email: athlete.email,
    emailVerified: athlete.emailVerified,
    username: athlete.username,
    password: athlete.password,
    passwordResetToken: athlete.passwordResetToken,
    passwordResetExpiration: athlete.passwordResetExpiration,
    gender: athlete.gender,
    measurementUnits: athlete.measurementUnits,
    birthday: athlete.birthday,
    status: athlete.status,
    createdAt: athlete.createdAt,
    updatedAt: athlete.updatedAt,
    deletedAt: athlete.deletedAt
  };

  // Remove null or undefined attributes
  cleanObj(formattedAthlete);

  return formattedAthlete;
}