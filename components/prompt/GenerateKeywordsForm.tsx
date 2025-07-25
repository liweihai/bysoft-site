'use client'

import {useState, useActionState} from 'react'
import {generatePromptKeywordsState} from "@/lib/actions";
import { Button } from "@/components/ui/button"

export default function GetenrateKeywordsForm({obj}) {
    const [message, formAction, isPending] = useActionState(generatePromptKeywordsState, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={obj.id} />
            <input type="hidden" name="content" value={obj.content} />
            <Button type="submit" variant="secondary" size="sm">{isPending ? "生成标签中..." : "生成标签"}</Button>
        </form>
    )
}