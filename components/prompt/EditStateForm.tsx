'use client'

import {useState, useActionState} from 'react'
import {editPromptState} from "@/lib/actions";

export default function EditStateForm({obj}) {
    const [message, formAction, isPending] = useActionState(editPromptState, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={obj.id} />
            
            {obj.state == 0 && (
                <>
                <input type="hidden" name="state" value={1} />
                <button type="submit" className="mx-5 px-5 py-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">{isPending ? "上线中..." : "上线"}</button>
                </>
            )}
            {obj.state != 0 && (
                <>
                <input type="hidden" name="state" value={0} />
                <button type="submit" className="mx-5 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none">{isPending ? "下线中..." : "下线"}</button>
                </>
            )}
        </form>
    )
}