import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res, next) => {
  try {
    const event = req.body;

    try {
      await axios.post('http://localhost:4000/events', event); // posts service
      await axios.post('http://localhost:4001/events', event); // comments service
      await axios.post('http://localhost:4002/events', event); // query service
    } catch (error) {
      res.status(500).send({ error: error.message });
      return;
    }

    res.status(200).send({ status: 'OK' });
  } catch (error) {
    next(error);
  }
});

app.listen(4004, () => {
  console.log('Event-bus service: started on port 4004');
});
