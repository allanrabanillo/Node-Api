const express = require('express');

const router = express.Router();


router.get('/', (req, res, next) => {

    res.status(200).json({
        message: 'GET REQUEST FROM ORDERS'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productID: req.body.productID,
        qty: req.body.qty
    }
    res.status(200).json({
        message: 'POST REQUEST FROM ORDERS',
        createdOrder: order
    });
});

router.post('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if (id == '1') {
        res.status(200).json({
            message: 'POST REQUEST FROM ORDERS',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'Invalid ID',
            id: id
        });
    }

});


module.exports = router;