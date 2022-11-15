const express = require('express');
const redis = require('redis');


const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';

const app = express();

const client = redis.createClient({url: REDIS_URL});
(async () => {
  await client.connect();
})();

app.get('/counter/:bookId', async (req, res) => {
  const {bookId} = req.params;
  const value = await client.get(bookId);
  await res.json(value ? value : 0);
});

app.post('/counter/:bookId/incr', async (req, res) => {
  const {bookId} = req.params;
  try {
    const coun = await client.incr(bookId);
    await res.json(`Счетчик ${bookId} увеличен на 1, значение ${coun}`);
  } catch (e) {
    await res.json("Err")
  }
});

app.listen(PORT,()=>{
});