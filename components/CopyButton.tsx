'use client'

import {useState} from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CopyButton({text}) {
    const [notificationShow, setNoticationShow] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);

        toast.success("复制粘贴板成功")

        setNoticationShow(true)
    }

    return (
        <Button variant="outline" onClick={(e) => handleCopy()}>复制</Button>
    )
}