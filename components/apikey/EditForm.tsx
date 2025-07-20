'use client'

import {  useState, useActionState } from 'react'
import {createApiKey} from "@/lib/actions";
import { Button } from "@/components/ui/button"

export default function EditForm({obj}) {
    const [message, formAction, isPending] = useActionState(createApiKey, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="customer_id" value={obj.customer_id} />
            
            <Button type="submit">{isPending ? "创建Api Key中..." : "创建Api Key"}</Button>
        </form>
    )
}