import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res, next) => {
  try {
    const { type, payload } = req.body;

    await eventHandler({ type, payload });

    res.status(200).send({ status: 'OK' });
  } catch (error) {
    next(error);
  }
});

const eventHandler = async ({ type, payload }) => {
  console.log('PROCESS', type);

  switch (type) {
    case 'CommentCreated':
      await commentCreated(payload);
      break;
    default:
      break;
  }
};

const commentCreated = async ({ id, content, status, postId }) => {
  try {
    const status = content.includes('orange') ? 'rejected' : 'approved';

    await dispatch(event('CommentModerated', { id, content, status, postId }));
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

const event = (type, payload) => {
  return { type, payload };
};

const dispatch = async ({ type, payload }) => {
  try {
    console.log('DISPATCH', type);

    await axios.post('http://localhost:4004/events', { type, payload }); // event-bus
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

app.listen(4003, () => {
  console.log('Comments Moderation Service: started on port 4003');
});
