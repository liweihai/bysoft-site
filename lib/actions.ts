'use server';

import { redirect } from 'next/navigation';
 
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import {updateModel, createModel} from "@/lib/data"
import {Config, Blog} from "@/lib/definitions"

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
        if (id) {
            await updateModel<Config>("Config", id, {id: id, name: name, value: value, create_time: null, update_time: null})
        } else {
            await createModel<Config>("Config", {id: null, name: name, value: value, create_time: null, update_time: null})
        }
        redirect('/dashboard/config')

        return 1
    } catch(error) {
        throw error;
    }
}

export async function saveBlog(prevState, formData) {
    const id = formData.get('id');
    const title = formData.get('title');
    const remark = formData.get('remark');
    const content = formData.get('content');
    const category = formData.get('category');
    const keywords = formData.getAll('keywords') as string[];
    const publish = formData.get('publish');
    const state = formData.get('state');

    try {
        if (id) {
            await updateModel<Blog>("Article", id, {id: id, title: title, remark: remark, content: content, category: category, keywords: keywords.join(","), create_time: null, update_time: null, publish: publish, state: state})
        } else {
            await createModel<Blog>("Article", {id: null, title: title, remark: remark, content: content, category: category, keywords: keywords.join(","), create_time: null, update_time: null, publish: publish, state: state})
        }

        redirect('/dashboard/blog')

        return 1
    } catch(error) {
        throw error;
    }
}