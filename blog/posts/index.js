import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
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

app.post('/posts', async (req, res, next) => {
  try {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    const post = { id, title };

    posts[id] = post;

    await dispatch(event('PostCreated', { ...post }));

    res.status(201).send(posts[id]);
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

app.listen(4000, () => {
  console.log('Posts service: started on port 4000');
});
