import express from 'express';
const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
  res.render('index',{title:'Book'});
});

export default indexRouter;