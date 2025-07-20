'use client'

import {useState, useActionState} from 'react'
import {deleteOne} from "@/lib/actions";
import { Button } from "@/components/ui/button"

export default function DelForm({obj}) {
    const [message, formAction, isPending] = useActionState(deleteOne, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="model" value={obj.model} />
            <input type="hidden" name="id" value={obj.id} />
            <input type="hidden" name="redirect_url" value={obj.redirect_url} />
            
            <Button variant="destructive" type="submit">{isPending ? "删除中..." : "删除"}</Button>
        </form>
    )
}