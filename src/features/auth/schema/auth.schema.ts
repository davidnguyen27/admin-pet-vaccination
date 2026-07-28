import * as yup from 'yup';

export const authSchema = (t: (key: string) => string) => {
  return yup.object({
    email: yup.string().required(t('auth.emailRequired')).email(t('auth.invalidEmail')),
    password: yup.string().required(t('auth.passwordRequired')),
  });
};
