const express = require('express');
const ExpressError = require('./expressError');
const itemsRoutes = require('./routes/items');

const app = express();

app.use(express.json());
app.use('/items', itemsRoutes);

// 404 handler

app.use(function (req, res, next) {
	return new ExpressError('Not Found', 404);
});

// general error handler

app.use((err, req, res, next) => {
	res.status(err.status || 500);

	return res.json({
		error: err.message
	});
});

module.exports = app; // export the app so we can use it in another file
