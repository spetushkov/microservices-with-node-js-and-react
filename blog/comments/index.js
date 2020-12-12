import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import express from 'express';

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/comments', (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId);
});

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[postId] = comments;

  res.status(201).send(commentsByPostId[postId]);
});

app.listen(4001, () => {
  console.log('Comments server: started on port 4001');
});
