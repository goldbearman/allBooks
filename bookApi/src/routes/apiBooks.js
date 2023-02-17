const exptress = require('express');
const router = exptress.Router();

router.get('/', (req, res) => {
  res.render('index',{title:'Api'});
});

module.exports = router;