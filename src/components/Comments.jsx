import React, { useEffect, useState } from 'react'
import { getComments, createComment, deleteComment, updateComment as updateCommentAPI } from "../config/api";
import SingleComment from '../components/SingleComment'
import CommentForm from '../components/CommentForm'

export default function Comments({ currentUserId }) {
  const [fetchComments, setFetchComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);

  useEffect(() => {
    getComments().then((data) => {
      setFetchComments(data)
    })
  }, [])

  const rootComments = fetchComments?.filter(comment => comment.parentId === null);

  const getReplies = (commentId) => {
    return fetchComments && fetchComments?.filter((cmt) => cmt.parentId === commentId)
      .sort((a, b) => new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime())
  }

  const addComment = (text, parentId) => {
    createComment(text, parentId).then((comment) => {
      setFetchComments([comment, ...fetchComments]);
      setActiveComment(null)
    })
  };

  const deleteCommentHandler = (commentId) => {
    if (window.confirm("Are you sure that you want to remove comment?")) {
      deleteComment(commentId).then(() => {
        const updatedComment = fetchComments?.filter((newcmt) => newcmt.id !== commentId);
        setFetchComments(updatedComment);
      })
    }
  };

  const updateComment = (text, commentId) => {
    updateCommentAPI().then(() => {
      const updatedComment = fetchComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, body: text }
        }
        return comment;
      })
      setFetchComments(updatedComment);
      setActiveComment(null)
    })
  }

  return (
    <div className='comments'>
      <h3 className='comments-title'>Comments</h3>
      <div className='comment-form-title'>Write Comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className='comments-container'>
        {rootComments.map((rootComments) => (
          <SingleComment
            key={rootComments.id}
            comment={rootComments}
            replise={getReplies(rootComments.id)}
            currentUserId={currentUserId}
            deleteCommentHandler={deleteCommentHandler}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            updateComment={updateComment} />
        ))}
      </div>
    </div>
  )
}
