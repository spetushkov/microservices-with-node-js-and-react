import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.get('/events', (req, res, next) => {
  try {
    res.status(200).send(events);
  } catch (error) {
    next(error);
  }
});

app.post('/events', async (req, res, next) => {
  try {
    const { type, payload } = req.body;

    console.log('PROCESS', type);

    const event = { type, payload };
    events.push(event);

    await service('Posts Service', 'http://localhost:4000/events', event);
    await service('Comments Service', 'http://localhost:4001/events', event);
    await service('Data Query Service', 'http://localhost:4002/events', event);
    await service('Comments Moderation Service', 'http://localhost:4003/events', event);

    res.status(200).send({ status: 'OK' });
  } catch (error) {
    next(error);
  }
});

const service = async (name, url, { type, payload }) => {
  try {
    await axios.post(url, { type, payload });
  } catch (error) {
    console.log(`${name} error:`, error.message);
  }
};

app.listen(4004, () => {
  console.log('Event-Bus Service: started on port 4004');
});
