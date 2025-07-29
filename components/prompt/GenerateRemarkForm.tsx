'use client'

import {useState, useActionState} from 'react'
import {generatePromptRemark} from "@/lib/actions";
import { Button } from "@/components/ui/button"

export default function GetenrateRemarkForm({obj}) {
    const [message, formAction, isPending] = useActionState(generatePromptRemark, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={obj.id} />
            <input type="hidden" name="content" value={obj.content} />
            <Button type="submit" variant="secondary" size="sm">{isPending ? "生成摘要中..." : "生成摘要"}</Button>
        </form>
    )
}