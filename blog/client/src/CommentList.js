import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getComments();
  }, [postId]);

  const commentsRendered = comments.map(comment => <li key={comment.id}>{comment.content}</li>);

  return <ul>{commentsRendered}</ul>;
};
