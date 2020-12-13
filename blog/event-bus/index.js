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

    await process('Posts Service', 'http://localhost:4000/events', event); // posts service
    await process('Comments Service', 'http://localhost:4001/events', event); // comments service
    await process('Data Query Service', 'http://localhost:4002/events', event); // query service
    await process('Comments Moderation Service', 'http://localhost:4003/events', event); // moderation service

    res.status(200).send({ status: 'OK' });
  } catch (error) {
    next(error);
  }
});

const process = async (name, url, { type, payload }) => {
  try {
    await axios.post(url, { type, payload });
  } catch (error) {
    console.log(`${name} error:`, error.message);
  }
};

app.listen(4004, () => {
  console.log('Event-Bus Service: started on port 4004');
});
