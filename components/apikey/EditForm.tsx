'use client'

import {  useState, useActionState } from 'react'
import {createApiKey} from "@/lib/actions";

export default function EditForm({obj}) {
    const [message, formAction, isPending] = useActionState(createApiKey, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="customer_id" value={obj.customer_id} />
            
            <button type="submit" className="mx-5 px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">{isPending ? "创建Api Key中..." : "创建Api Key"}</button>
        </form>
    )
}