'use client'

import React, { useState, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

function TinyMCEEditor({ initialValue, onChange }) {
  const editorRef = useRef(null)
  const [content, setContent] = useState(initialValue || '')

  const handleEditorChange = (value, editor) => {
    setContent(value)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Editor
      apiKey="ui4wpfrlpb70k3x3u37r54r2ve5w2jn14hv2vcal53b8laag" // Replace with your actual API key
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      onEditorChange={handleEditorChange}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  )
}

export default TinyMCEEditor
