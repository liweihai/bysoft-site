'use client'

import {useState, useActionState} from 'react'
import {generatePromptKeywords} from "@/lib/actions";
import { Button } from "@/components/ui/button"

export default function GetenrateKeywordsForm({obj}) {
    const [message, formAction, isPending] = useActionState(generatePromptKeywords, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="id" value={obj.id} />
            <input type="hidden" name="content" value={obj.content} />
            <Button type="submit" variant="secondary" size="sm">{isPending ? "生成标签中..." : "生成标签"}</Button>
        </form>
    )
}