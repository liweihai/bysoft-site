'use client'

import TinyMCEEditor from '@/components/TinyMCEEditor'

export default function EditForm({id, title, content}) {
    return (
      <div className="mx-auto p-4">
          <form>
              <div className="mb-6">
                  <label htmlFor="title" className="block text-lg font-medium text-gray-800 mb-1">标题</label>
                  <input type="text" defaultValue={title} id="title" name="title" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500" required />
              </div>

              <div className="mb-6">
                  <label htmlFor="content" className="block text-lg font-medium text-gray-800 mb-1">内容</label>
                  <TinyMCEEditor onChange={(e) => content = e} initialValue={content} />
              </div>

              <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none">保存文章</button>
              </div>
          </form>
      </div>
    )
}