var db = require('./_db');

var Place = require('./place');
var Hotel = require('./hotel');
var Restaurant = require('./restaurant');
var Activity = require('./activity');
var Day = require('./day');
var Meal = require('./meal');
var Adventure = require('./adventure')

Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);

Day.belongsTo(Hotel);

//Day.belongsToMany(Restaurant, {through: 'meal'});
//Day.belongsToMany(Activity, {through: 'adventure'});
//Restaurant.belongsToMany(Day, {through: 'meal'});
//Activity.belongsToMany(Day, {through: 'adventure'});

Meal.belongsTo(Day);
Meal.belongsTo(Restaurant);
Day.hasMany(Meal);
Restaurant.hasMany(Meal);


Adventure.belongsTo(Day);
Adventure.belongsTo(Activity);
Day.hasMany(Adventure);
Activity.hasMany(Adventure);

module.exports = db;
