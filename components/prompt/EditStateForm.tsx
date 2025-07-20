'use client'

import {useState, useActionState} from 'react'
import {editPromptState} from "@/lib/actions";
import { Button } from "@/components/ui/button"

export default function EditStateForm({obj}) {
    const [message, formAction, isPending] = useActionState(editPromptState, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={obj.id} />
            
            {obj.state == 0 && (
                <>
                <input type="hidden" name="state" value={1} />
                <Button type="submit" variant="destructive">{isPending ? "上线中..." : "上线"}</Button>
                </>
            )}
            {obj.state != 0 && (
                <>
                <input type="hidden" name="state" value={0} />
                <Button type="submit" variant="secondary">{isPending ? "下线中..." : "下线"}</Button>
                </>
            )}
        </form>
    )
}