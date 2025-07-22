'use server';

import { redirect } from 'next/navigation';
 
import { AuthError } from 'next-auth';

import { signIn } from '@/auth';
import {updateModel, createModel, deleteModel, getModel, findModels, chatWith} from "@/lib/data"
import {Config, Prompt, Endpoint, QuotaGroup, Quota, ApiKey, Cooperation, Chat} from "@/lib/definitions"

export async function authenticate(obj) {
    await signIn('credentials', obj);
}

export async function saveConfig(obj) {
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

export async function savePrompt(obj) {
    if (obj.id) {
        await updateModel<Prompt>("Article", obj.id, obj)
    } else {
        await createModel<Prompt>("Article", obj)
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

export async function deleteOne(model, id) {
    return await deleteModel(model, id)
}

export async function aiChat(prevState: Chat, formData: FormData) {
    const obj = Object.fromEntries(formData.entries());

    try {
        return await chatWith(prevState, obj)
    } catch(error) {
        throw error;
    }

}