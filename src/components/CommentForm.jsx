import React, { useState } from 'react'

export default function CommentForm({ submitLabel, handleSubmit, hasCancelButton = false, intialText = "", handleCancel }) {
  const [text, setText] = useState(intialText);

  const isTextAreaDisabled = text.length === 0;

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text);
    setText("");
  }
  return (
    <form onSubmit={onSubmit}>
      <textarea className='comment-form-textarea' value={text} onChange={(e) => setText(e.target.value)} />
      <button className='comment-form-button' disabled={isTextAreaDisabled}>{submitLabel}</button>
      {hasCancelButton && (
        <button
          type="button"
          className="comment-form-button comment-form-cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
    </form>
  )
}
