'use server';
 
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return '用户名或密码不正确';
                default:
                    return '未知错误，请稍后再试';
            }
        }
        throw error;
    }
}