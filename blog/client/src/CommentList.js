import React from 'react';

export const CommentList = ({ comments }) => {
  const commentsRendered = comments.map(comment => <li key={comment.id}>{comment.content}</li>);

  return <ul>{commentsRendered}</ul>;
};
