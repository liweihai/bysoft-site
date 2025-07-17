'use server';

import { redirect } from 'next/navigation';
 
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import {updateModel, createModel, deleteModel, getModel, findModels, chatWith} from "@/lib/data"
import {Config, Prompt, Endpoint, QuotaGroup, Quota, ApiKey, Cooperation} from "@/lib/definitions"

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

export async function editPromptState(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as Prompt;

    try {
        await updateModel<Prompt>("Article", obj.id, obj)

        redirect('/dashboard/prompt')

        return 1
    } catch(error) {
        throw error;
    }
}

export async function savePrompt(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as Prompt;
    obj.keywords = formData.getAll('keywords');

    try {
        if (obj.id) {
            await updateModel<Prompt>("Article", obj.id, obj)
        } else {
            await createModel<Prompt>("Article", obj)
        }

        redirect('/dashboard/prompt')

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

export async function editQuotaPriority(prevState, formData) {
    const obj = Object.fromEntries(formData.entries());

    try {
        const quota  = await getModel<Quota>("Quota", obj.id)
        const quotas = await findModels<Quota>("Quota", {quota_group_id: quota.quota_group_id}, {order: "priority ASC"})

        const i = quotas.findIndex(function(q) { return q.id == obj.id})
        if (obj.direction == 1) {
            if (i < quotas.length - 1) {
                quota.priority = quota.priority + 1
                await updateModel<Quota>("Quota", quota.id, quota)

                quotas[i + 1].priority = quotas[i + 1].priority - 1
                await updateModel<Quota>("Quota", quotas[i + 1].id, quotas[i + 1])
            }
        } else {
            if (i > 0) {
                quota.priority = quota.priority - 1
                await updateModel<Quota>("Quota", quota.id, quota)

                quotas[i - 1].priority = quotas[i - 1].priority + 1
                await updateModel<Quota>("Quota", quotas[i - 1].id, quotas[i - 1])
            }
        }

        redirect('/dashboard/quotagroup/view/' + quota.quota_group_id)

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

export async function createCooperation(prevState, formData) {
    const obj = Object.fromEntries(formData.entries()) as Cooperation;

    try {
        await createModel<Cooperation>("Cooperation", obj)

        return 1
    } catch(error) {
        throw error;
    }
}

export async function deleteOne(prevState, formData) {
    const obj = Object.fromEntries(formData.entries());

    try {
        await deleteModel(obj.model, obj.id)

        if (obj.redirect_url) {
            redirect(obj.redirect_url)
        } else {
            redirect('/dashboard/' + obj.model.toLowerCase())
        }

        return 1
    } catch(error) {
        throw error;
    }
}

export async function chat(
  prevState: [],
  formData: FormData,
) {
    const obj = Object.fromEntries(formData.entries());

    try {
        return await chatWith(prevState, obj)
    } catch(error) {
        throw error;
    }

}