'use client'

import Notification from './Notification'
import {useState, useActionState} from 'react'

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
            
            <button className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none" onClick={(e) => handleCopy()}>复制</button>
        </>
    )
}