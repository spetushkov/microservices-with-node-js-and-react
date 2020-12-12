import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  const event = {
    type: 'PostCreated',
    payload: { id, title }
  };

  try {
    await axios.post('http://localhost:4003/events', event); // event-bus
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.log(error);
    return;
  }

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  const { type, payload } = req.body;
  console.log('type', type);
  res.status(200).send({});
});

app.listen(4000, () => {
  console.log('Posts service: started on port 4000');
});
