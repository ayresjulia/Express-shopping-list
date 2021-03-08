const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const items = require('../fakeDb');

// GET /items - this should render a list of shopping items.
// [{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]
router.get('/', (req, res) => {
	res.json({ items });
});

// POST /items - this route should accept JSON data and add it to the shopping list.
// {“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}
router.post('/', (req, res, next) => {
	try {
		if (!req.body.name && !req.body.price) throw new ExpressError('Item is required', 400);
		const newItem = { name: req.body.name, price: req.body.price };
		items.push(newItem);
		res.status(201).json({ item: newItem });
	} catch (e) {
		next(e);
	}
});

// GET /items/:name - this route should display a single item’s name and price.
// {“name”: “popsicle”, “price”: 1.45}
router.get('/:name', (req, res) => {
	const foundItem = items.find(item => item.name === req.params.name);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	res.json({ item: foundItem });
});

// PATCH /items/:name, this route should modify a single item’s name and/or price.
// {“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}
router.patch('/:name', (req, res) => {
	const foundItem = items.find(item => item.name === req.params.name);
	if (foundItem === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	foundItem.name = req.body.name;
	foundItem.price = req.body.price;
	res.json({ item: foundItem });
});

// DELETE /items/:name - this route should allow you to delete a specific item from the array.
// {message: “Deleted”}
router.delete('/:name', function (req, res) {
	const foundItem = items.findIndex(item => item.name === req.params.name);
	if (foundItem === -1) {
		throw new ExpressError('Item not found', 404);
	}
	items.splice(foundItem, 1);
	res.json({ message: 'Deleted' });
});

module.exports = router;
