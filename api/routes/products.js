const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/products');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(doc => {
            const response = {
                count: doc.length,
                products: doc.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            if (doc) {
                res.status(200).json(response);
            } else {
                res.status(404).json({ message: "No product found!" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    products: doc,
                    request: {
                        type: "GET",
                        description: "Get all the products",
                        url: "http://localhost:3000/products"
                    }
                });
            } else {
                res.status(404).json({ message: "ID does not exist" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Products successfully created.',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product Updated Successfully.",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product deleted succesfully.",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: {
                        name: "String",
                        price: "Number"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

});


module.exports = router;