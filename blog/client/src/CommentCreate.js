import axios from 'axios';
import React, { useState } from 'react';

export const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const submitHandler = async e => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:4001/posts/${postId}/comments`, { content });
    } catch (error) {
      console.log(error);
      return;
    }
    setContent('');
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label>New Comment</label>
          <input
            type='text'
            className='form-control'
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};
