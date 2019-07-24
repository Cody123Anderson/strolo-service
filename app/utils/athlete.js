import { cleanObj } from './format-data';

export function formatUser(athlete) {
  const formattedAthlete = {
    athleteId: athlete.athleteId,
    createdAt: athlete.createdAt,
    deletedAt: athlete.deletedAt,
    updatedAt: athlete.updatedAt,
    firstName: athlete.firstName,
    lastName: athlete.lastName,
    email: athlete.email,
    emailVerified: athlete.emailVerified,
    password: athlete.password,
    passwordResetToken: athlete.passwordResetToken,
    passwordResetExpiration: athlete.passwordResetExpiration,
    phone: athlete.phone,
    birthday: athlete.birthday,
    status: athlete.status
  };

  // Remove null or undefined attributes
  cleanObj(formattedAthlete);

  return formattedAthlete;
}