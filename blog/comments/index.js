import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/comments', (req, res) => {
  res.status(200).send(commentsByPostId);
});

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.status(200).send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[postId] = comments;

  const event = {
    type: 'CommentCreated',
    payload: { id: commentId, content, postId }
  };

  try {
    await axios.post('http://localhost:4003/events', event); // event-bus
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.log(error);
    return;
  }

  res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', (req, res) => {
  const { type, payload } = req.body;
  console.log('type', type);
  res.status(200).send({});
});

app.listen(4001, () => {
  console.log('Comments service: started on port 4001');
});
