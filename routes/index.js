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

router.get('/api/days', (req, res, next)=> {
  Day.findAll( 
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

router.post('/api/days', (req, res, next)=> {
  Day.create(req.body)
  .then((day)=>{
    res.status(201).send(day);
  })
  .catch(next);
});

router.delete('/api/days/id', (req, res, next)=> {
  Day.destroy({where: {id: req.params.id}})
  .then(()=>{
    res.sendStatus(204);
  })
  .catch(next);
});

//register a hotel to a day
router.put('/api/days/:id/hotel', (req, res, next)=> {
  Day.findById(req.params.id)
  then((day)=> {
    return day.setHotel(req.body.hotelId);
  })
  .then(()=> {
    res.sendStatus(204);
  })
  .catch(next);
})

//register a restaurant to a day
router.put('/api/day/:id/restaurant', (req, res, next)=>{
  Day.findById(req.params.id)
  .then((day)=>{
    return day.addRestaurant(req.body.restaurantId)
  })
  .then(()=> res.sendStatus(204))
  .catch(next);
});

//register an activity to a day
router.put('/api/day/:id/activity', (req, res, next)=>{
  Day.findById(req.params.id)
  .then((day)=>{
    return day.addActivity(req.body.activityId)
  })
  .then(()=> res.sendStatus(204))
  .catch(next);
});

//remove a hotel from a day
router.delete('/api/days/:id/hotel', (req, res, next)=> {
  Day.findById(req.params.id)
  .then((day)=> {
    return day.setHotel(null);
  })
  .then(()=> res.sendStatus(204))
  .catch(next);
});

//remove a restaurant from a day
router.delete('/api/day/:id/restautants/:restaurantId', (req, res, next)=> {
  Day.findById(req.params.id)
  .then((day)=> {
    return day.removeRestaurant(req.params.restaurantId);
  })
  .then(()=> res.sendStatus(204))
  .catch(next);
});


//remove an activity from a day
router.delete('/api/day/:id/activities/:activityId', (req, res, next)=> {
  Day.findById(req.params.id)
  .then((day)=> {
    return day.removeActivity(req.params.activityId);
  })
  .then(()=> res.sendStatus(204))
  .catch(next);
});

module.exports = router;
