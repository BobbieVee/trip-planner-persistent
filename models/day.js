var db = require('./_db');

const Day = db.define('day',{
	number: {
		type: db.Sequelize.INTEGER
	}
})

module.exports = Day;
