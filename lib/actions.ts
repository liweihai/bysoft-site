'use server';

import { redirect } from 'next/navigation';
 
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import {updateModel, createModel, deleteModel} from "@/lib/data"
import {Config, Blog, Endpoint, QuotaGroup, Quota, ApiKey} from "@/lib/definitions"

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
    const obj = Object.fromEntries(formData.entries()) as Config;

    try {
        if (obj.id) {
            await updateModel<Config>("Config", obj.id, obj)
        } else {
            await createModel<Config>("Config", obj)
        }
        redirect('/dashboard/config')

        return 1
    } catch(error) {
        throw error;
    }
}

export async function saveBlog(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as Blog;
    obj.keywords = formData.getAll('keywords');

    try {
        if (obj.id) {
            await updateModel<Blog>("Article", obj.id, obj)
        } else {
            await createModel<Blog>("Article", obj)
        }

        redirect('/dashboard/blog')

        return 1
    } catch(error) {
        throw error;
    }
}

export async function saveEndpoint(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as Endpoint;
    obj.modals = formData.getAll('modals');

    try {
        if (obj.id) {
            await updateModel<Endpoint>("Endpoint", obj.id, obj)
        } else {
            await createModel<Endpoint>("Endpoint", obj)
        }
        redirect('/dashboard/endpoint')

        return 1
    } catch(error) {
        throw error;
    }
}

export async function saveQuotaGroup(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as QuotaGroup;

    try {
        if (obj.id) {
            await updateModel<QuotaGroup>("QuotaGroup", obj.id, obj)
        } else {
            await createModel<QuotaGroup>("QuotaGroup", obj)
        }
        redirect('/dashboard/quotagroup')

        return 1
    } catch(error) {
        throw error;
    }
}

export async function saveQuota(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as Quota;

    try {
        if (obj.id) {
            await updateModel<Quota>("Quota", obj.id, obj)
        } else {
            await createModel<Quota>("Quota", obj)
        }
        redirect('/dashboard/quotagroup/view/' + obj.quota_group_id)

        return 1
    } catch(error) {
        throw error;
    }
}

export async function createApiKey(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as ApiKey;

    try {
        await createModel<ApiKey>("ApiKey", obj)

        redirect('/dashboard/apikey')

        return 1
    } catch(error) {
        throw error;
    }
}

export async function deleteOne(prevState, formData) {
    const obj = Object.fromEntries(formData.entries());

    try {
        await deleteModel(obj.model, obj.id)

        redirect(formData.redirect_url || ('/dashboard/' + obj.model.toLowerCase()))

        return 1
    } catch(error) {
        throw error;
    }
}