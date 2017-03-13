var Promise = require('bluebird');
var router = require('express').Router();
var Hotel = require('../models/hotel');
var Restaurant = require('../models/restaurant');
var Activity = require('../models/activity');
var Day = require('../models/day');
var Meal = require('../models/meal');
var Adventure = require('../models/adventure');

router.get('/', function(req, res, next) {
  Promise.all([
    Hotel.findAll(),
    Restaurant.findAll(),
    Activity.findAll()
  ])
  .spread(function(dbHotels, dbRestaurants, dbActivities) {
    res.render('index', {
      templateHotels: dbHotels,
      templateRestaurants: dbRestaurants,
      templateActivities: dbActivities
    });
  })
  .catch(next);
});

router.get('/api/options', (req, res, next)=> {
   Promise.all([
    Hotel.findAll(),
    Restaurant.findAll(),
    Activity.findAll()
  ])
  .spread(function(dbHotels, dbRestaurants, dbActivities) {
    res.status(200).json([
      dbHotels,
      dbRestaurants,
      dbActivities
    ]);
  })
  .catch(next);
});

router.get('/api/days/:id', (req, res, next)=> {
  Day.findById(req.params.id, 
    {
      include: 
      [ 
        { model: Hotel},
        { model: Adventure, include:[ Activity ] },
        { model: Meal, include: [Restaurant]}
      ]})
  .then((day)=>{
      res.status(200).json(day);
  })
  .catch(next);
});


module.exports = router;
