import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/events', async (req, res) => {
  const { type, payload } = req.body;

  switch (type) {
    case 'PostCreated':
      const { id, title } = payload;
      posts[id] = { id, title, commments: [] };
      break;
    case 'CommentCreated':
      const { id, content, postId } = payload;
      const post = posts[postId];
      if (post) {
        post.comments.push({ id, content });
      }
      break;
    default:
      break;
  }

  res.status(200).send({ status: 'OK' });
});

const postCreated = () => {};

app.listen(4002, () => {
  console.log('Event-bus-query service: started on port 4002');
});
