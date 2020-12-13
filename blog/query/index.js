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

    switch (type) {
      case 'PostCreated':
        postCreated(payload);
        break;
      case 'CommentCreated':
        commentCreated(payload);
        break;
      default:
        break;
    }

    res.status(200).send({ status: 'OK' });
  } catch (error) {
    next(error);
  }
});

const postCreated = ({ id, title }) => {
  posts[id] = { id, title, comments: [] };
};

const commentCreated = ({ id, content, postId }) => {
  const post = posts[postId];
  if (post) {
    post.comments.push({ id, content });
  }
};

app.listen(4002, () => {
  console.log('Query service: started on port 4002');
});
