'use strict';

exports.init = function(req, res) {
	// res.locals.users = req.users;
	console.log(res.users);
	res.render('activities/popular/index');
};