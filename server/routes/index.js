const express = require('express');
const router = express.Router();
//look at differnt ways to send data via send and json

// Do work here
//example: localhost:7777/?name=jeremy&age=30&cool=false
router.get('/', (req, res) => {
  const jer = { name: "jeremy", age: 20, cool: true};
  //res.send('Hey! It works!');
  //res.json(jer)
  //res.send(req.query.name);

  //get query parameters
  //res.send(req.query);

  res.render("hello");
});

//putting colon behind will give you a variable on each of your requests
//example localhost:7777/reverse/jeremy
router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join()
  //req.params to access things in the URL
  //res.send(req.params.name);
  res.send(reverse)
})
module.exports = router;
