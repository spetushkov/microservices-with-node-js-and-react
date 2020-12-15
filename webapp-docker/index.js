import bodyParser from 'body-parser';
import express from 'express';

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  try {
    res.status(200).send('Bye there!');
  } catch (error) {
    next(error);
  }
});

app.listen(8080, () => console.log('App: started on port 8080'));
