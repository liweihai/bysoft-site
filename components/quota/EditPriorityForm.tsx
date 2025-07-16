'use client'

import Link from 'next/link';
import { useActionState } from 'react'

import { EditQuotaPriority } from "@/lib/actions";

import {
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function EditPriorityForm({id, direction}) {
    const [message, formAction, isPending] = useActionState(EditQuotaPriority, undefined);

    return (
        <div className="min-w-full">
            <form action={formAction}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="direction" value={direction} />
                <button type="submit">
                {direction == -1 && (
                    <ArrowUpIcon className="w-6"></ArrowUpIcon>
                )}
                {direction == 1 && (
                    <ArrowDownIcon className="w-6"></ArrowDownIcon>
                )}
                </button>
            </form>
        </div>
    )
}