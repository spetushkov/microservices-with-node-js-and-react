import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/comments', (req, res, next) => {
  try {
    res.status(200).send(commentsByPostId);
  } catch (error) {
    next(error);
  }
});

app.get('/posts/:id/comments', (req, res, next) => {
  try {
    const postId = req.params.id;
    res.status(200).send(commentsByPostId[postId] || []);
  } catch (error) {
    next(error);
  }
});

app.post('/posts/:id/comments', async (req, res, next) => {
  try {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const postId = req.params.id;

    const comment = { id: commentId, content, status: 'pending' };

    const comments = commentsByPostId[postId] || [];
    comments.push(comment);
    commentsByPostId[postId] = comments;

    await dispatch(event('CommentCreated', { ...comment, postId }));

    res.status(201).send(commentsByPostId[postId]);
  } catch (error) {
    next(error);
  }
});

app.post('/events', (req, res, next) => {
  try {
    const { type, payload } = req.body;
    res.status(200).send({});
  } catch (error) {
    next(error);
  }
});

const event = (type, payload) => {
  return { type, payload };
};

const dispatch = async ({ type, payload }) => {
  try {
    await axios.post('http://localhost:4004/events', { type, payload }); // event-bus
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

app.listen(4001, () => {
  console.log('Comments service: started on port 4001');
});
