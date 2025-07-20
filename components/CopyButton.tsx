'use client'

import Notification from './Notification'
import {useState} from 'react'
import { Button } from "@/components/ui/button"

export default function CopyButton({text}) {
    const [notificationShow, setNoticationShow] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);

        setNoticationShow(true)
    }

    return (
        <>
            {notificationShow && (
                <Notification title="成功" message="复制粘贴板成功" type="success" onClose={e => setNoticationShow(false)} />
            )}
            
            <Button variant="outline" onClick={(e) => handleCopy()}>复制</Button>
        </>
    )
}