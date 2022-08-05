import React from 'react'
import CommentForm from './CommentForm';

export default function SingleComment({
  comment,
  replise,
  currentUserId,
  deleteCommentHandler,
  activeComment,
  setActiveComment,
  addComment,
  parentId = null,
  updateComment,
}) {

  //currentUserid is there or null.
  const canReply = Boolean(currentUserId);

  //User can delete or edit comment only for 5 min when comment created
  const fiveMinutes = 300000; // five min in miliseconds
  const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes; // make diffrence that five min passed!
  const canEdit = currentUserId === comment.userId && !timePassed;
  const canDelete = currentUserId === comment.userId && !timePassed;

  const createAt = new Date(comment.createdAt).toLocaleDateString();

  const isReplying = activeComment && activeComment.type === "Replying" && activeComment.id === comment.id;
  const isEditing = activeComment && activeComment.type === "Editing" && activeComment.id === comment.id;

  const replyId = parentId ? parentId : comment.id;
  return (
    <div className='comment'>
      <div className='comment-image-container'>
        <img src="/user-icon.png" />
      </div>
      <div className='comment-right-part'>
        <div className='comment-content'>
          <div className='comment-author'>{comment.username}</div>
          <div>{createAt}</div>
        </div>
        {!isEditing && <div className='comment-text'>{comment.body}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
            intialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment.id)}
            handleCancel={() => setActiveComment(null)}
          />
        )}
        <div className='comment-actions'>
          {canReply && <div className='comment-action' onClick={() => setActiveComment({ id: comment.id, type: "Replying" })}>Reply</div>}
          {canEdit && <div className='comment-action' onClick={() => setActiveComment({ id: comment.id, type: "Editing" })}>Edit</div>}
          {canDelete && <div className='comment-action' onClick={() => deleteCommentHandler(comment.id)}>Delete</div>}
        </div>
        {isReplying && (
          <CommentForm submitLabel="Reply" handleSubmit={(text) => addComment(text, replyId)} />
        )}
        {replise.length > 0 && (
          <div className='replies'>
            {replise?.map((reply) => (
              <SingleComment
                key={reply.id}
                comment={reply}
                replise={[]}
                currentUserId={currentUserId}
                deleteCommentHandler={deleteCommentHandler}
                parentId={comment.id}
                addComment={addComment}
                activeComment={activeComment}
                setActiveComment={setActiveComment}
                updateComment={updateComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
