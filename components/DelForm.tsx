'use client'

import {useState, useActionState} from 'react'
import {deleteOne} from "@/lib/actions";

export default function DelForm({obj}) {
    const [message, formAction, isPending] = useActionState(deleteOne, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="model" value={obj.model} />
            <input type="hidden" name="id" value={obj.id} />
            <input type="hidden" name="redirect_url" value={obj.redirect_url} />
            
            <button type="submit" className="mx-5 px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">{isPending ? "删除中..." : "删除"}</button>
        </form>
    )
}