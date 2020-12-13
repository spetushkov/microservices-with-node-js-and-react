import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res, next) => {
  try {
    res.status(200).send({ status: 'OK' });
  } catch (error) {
    next(error);
  }
});

app.listen(4003, () => {
  console.log('Moderation service: started on port 4003');
});
