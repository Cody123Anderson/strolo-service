import { cleanObj } from './format-data';

export function formatUser(user) {
  const formattedUser = {
    userId: user.userId,
    createdAt: user.createdAt,
    deletedAt: user.deletedAt,
    updatedAt: user.updatedAt,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    password: user.password,
    passwordResetToken: user.passwordResetToken,
    passwordResetExpiration: user.passwordResetExpiration,
    phone: user.phone,
    birthday: user.birthday,
    status: user.status,
    plusOneFirstName: user.plusOneFirstName
  };

  // Remove null or undefined attributes
  cleanObj(formattedUser);

  return formattedUser;
}