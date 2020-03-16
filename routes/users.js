
var express = require('express');
var router = express.Router();

let serverCarArray = []; // our "permanent storage" on the web server

// define a constructor to create movie objects
var CarObject = function (pMake, pModel, pYear, pMile, pPrice) {
  this.Make = pMake;  // action  comedy  drama  horrow scifi  musical  western
  this.Model = pModel;
  this.Year = pYear;
  this.Mile = pMile;
  this.Price = pPrice;
}

// for testing purposes, its nice to preload some data
serverCarArray.push(new CarObject("Nissan", "Sentra", 2015, "800000", "15000"));
serverCarArray.push(new CarObject("Ford", "Mustang", 2017, "350000", "25500"));
serverCarArray.push(new CarObject("Acura", "RDX", 2010, "860000", "1000"));

/* POST to addMovie */
router.post('/addCar', function(req, res) {
  console.log(req.body);
  serverCarArray.push(req.body);
  console.log(serverCarArray);
  //res.sendStatus(200);
  res.status(200).send(JSON.stringify('success'));
});



/* GET movieList. */
router.get('/carList', function(req, res) {
  res.json(serverCarArray);
 });

 /* DELETE to deleteMovie. */
 router.delete('/deleteCar/:Model', function(req, res) {
  let Model = req.params.Model;
  Model = Model.toLowerCase();  // allow user to be careless about capitalization
  console.log('deleting ID: ' + Model);
   for(let i=0; i < serverCarArray.length; i++) {
     if(Model == (serverCarArray[i].Model).toLowerCase()) {
     serverCarArray.splice(i,1);
     }
   }
   res.status(200).send(JSON.stringify('deleted successfully'));
});


//  router.???('/userlist', function(req, res) {
//  users.update({name: 'foo'}, {name: 'bar'})



module.exports = router;

