import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res, next) => {
  try {
    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
});

app.post('/events', (req, res, next) => {
  try {
    const { type, payload } = req.body;

    eventHandler({ type, payload });

    res.status(200).send({ status: 'OK' });
  } catch (error) {
    next(error);
  }
});

const eventHandler = ({ type, payload }) => {
  console.log('PROCESS', type);

  switch (type) {
    case 'PostCreated':
      postCreated(payload);
      break;
    case 'CommentCreated':
      commentCreated(payload);
      break;
    case 'CommentUpdated':
      commentUpdated(payload);
      break;
    default:
      break;
  }
};

const postCreated = ({ id, title }) => {
  posts[id] = { id, title, comments: [] };
};

const commentCreated = ({ id, content, status, postId }) => {
  const post = posts[postId];
  if (post) {
    post.comments.push({ id, content, status });
  }
};

const commentUpdated = ({ id, content, status, postId }) => {
  const post = posts[postId];
  if (post) {
    const comment = post.comments.find(comment => comment.id === id);
    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }
};

app.listen(4002, async () => {
  try {
    console.log('Data Query Service: started on port 4002');

    const response = await axios.get('http://localhost:4004/events'); // event-bus

    for (let event of response.data) {
      const { type, payload } = event;
      eventHandler({ type, payload });
    }
  } catch (error) {
    console.log(error.message);
  }
});
