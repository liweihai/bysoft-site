'use client'

import { useActionState, useState } from 'react'
import {
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import {saveConfig} from "@/lib/actions";

export default function EditForm({obj}) {
    const [message, formAction, isPending] = useActionState(saveConfig, undefined);

    return (
      <div className="mx-auto p-4">
          <form action={formAction}>
              <input type="hidden" name="id" value={obj.id} />

              <div className="mb-6">
                  <label htmlFor="name" className="block text-lg font-medium text-gray-800 mb-1">名称</label>
                  <input type="text" defaultValue={obj.name} id="name" name="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" required />
              </div>

                <div className="mb-6">
                  <label htmlFor="value" className="block text-lg font-medium text-gray-800 mb-1">值</label>
                  <input type="text" defaultValue={obj.value} id="value" name="value" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" required />
              </div>

              <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none">{isPending ? "保存配置中..." : "保存配置"}</button>
              </div>

            {message && (
                <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{message}</p>
                </>
            )}
          </form>
      </div>
    )
}