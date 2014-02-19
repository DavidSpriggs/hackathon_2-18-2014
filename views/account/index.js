'use strict';

exports.init = function(req, res) {
	res.locals.user.nameParts = req.user.roles.account.name;
	res.locals.user.reputation = req.user.roles.account.reputation;
	res.render('account/index');
};