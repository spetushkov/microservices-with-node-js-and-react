import React from 'react';

export const CommentList = ({ comments }) => {
  const commentsRendered = comments.map(comment => (
    <li key={comment.id}>
      {comment.content} ({comment.status})
    </li>
  ));

  return <ul>{commentsRendered}</ul>;
};
