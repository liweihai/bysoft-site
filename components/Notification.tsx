'use client'

import {useState} from 'react'

export default function Notification({type, title, message, onClose}) {
    setTimeout(() => {
        onClose()
    }, 3000);

    return (
        <>
        <div className="fixed bottom-10 right-10 w-150">
            {type == 'info' && (
            <div className="relative w-full overflow-hidden rounded-sm border border-sky-500 bg-white text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300" role="alert">
                <div className="flex w-full items-center gap-2 bg-sky-500/10 p-4">
                    <div className="bg-sky-500/15 text-sky-500 rounded-full p-1" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6" aria-hidden="true">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-2">
                        <h3 className="text-sm font-semibold text-sky-500">{ title }</h3>
                        <p className="text-xs font-medium sm:text-sm">{ message }</p>
                    </div>
                    <button className="ml-auto" aria-label="dismiss alert" onClick={() => onClose()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2.5" className="size-4 shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            )}

            {type == 'success' && (
            <div className="relative w-full overflow-hidden rounded-sm border border-green-500 bg-white text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300" role="alert">
                <div className="flex w-full items-center gap-2 bg-green-500/10 p-4">
                    <div className="bg-green-500/15 text-green-500 rounded-full p-1" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-2">
                        <h3 className="text-sm font-semibold text-green-500">{ title }</h3>
                        <p className="text-xs font-medium sm:text-sm">{ message }</p>
                    </div>
                    <button className="ml-auto" aria-label="dismiss alert" onClick={() => onClose()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2.5" className="size-4 shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            )}

            {type == 'warning' && (
            <div className="relative w-full overflow-hidden rounded-sm border border-amber-500 bg-white text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300" role="alert">
                <div className="flex w-full items-center gap-2 bg-amber-500/10 p-4">
                    <div className="bg-amber-500/15 text-amber-500 rounded-full p-1" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6" aria-hidden="true">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-2">
                        <h3 className="text-sm font-semibold text-amber-500">{ title }</h3>
                        <p className="text-xs font-medium sm:text-sm">{ message }</p>
                    </div>
                    <button className="ml-auto" aria-label="dismiss alert" onClick={() => onClose()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2.5" className="size-4 shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            )}

            {type == 'danger' && (
            <div className="relative w-full overflow-hidden rounded-sm border border-red-500 bg-white text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300" role="alert">
                <div className="flex w-full items-center gap-2 bg-red-500/10 p-4">
                    <div className="bg-red-500/15 text-red-500 rounded-full p-1" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-2">
                        <h3 className="text-sm font-semibold text-red-500">{ title }</h3>
                        <p className="text-xs font-medium sm:text-sm">{ message }</p>
                    </div>
                    <button className="ml-auto" aria-label="dismiss alert" onClick={() => onClose()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="2.5" className="size-4 shrink-0">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            )}
        </div>
        </>
    )
}