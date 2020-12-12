import axios from 'axios';
import React, { useState } from 'react';

export const PostCreate = () => {
  const [title, setTitle] = useState('');

  const submitHandler = async e => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:4000/posts', { title });
      setTitle('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label>New Post</label>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};
