'use server';

import { redirect } from 'next/navigation';
 
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import {updateModel, createModel} from "@/lib/data"
import {Config} from "@/lib/definitions"

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

export async function saveConfig(prevState, formData) {
    const id = formData.get('id');
    const name = formData.get('name');
    const value = formData.get('value');

    try {
        await updateModel<Config>("Config", id, {id: id, name: name, value: value, create_time: null, update_time: null})

        redirect('/dashboard/config')

        return ""
    } catch(error) {
        throw error;
    }
}