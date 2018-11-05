const Order = require('../models/order');
const User = require('../models/user');

exports.createOrder = (req, res, next) => {
  const order = new Order({
    title: req.body.title,
    seller: req.body.seller,
    tracking: req.body.tracking,
    status: req.body.status,
    origin: req.body.origin,
    destination: req.body.destination,
    expectedDate: req.body.expectedDate,
    creator: req.userData.userId
  });
  order.save().then(createdOrder => {
    User.updateOne(
      {_id: req.userData.userId},
      {$addToSet: {orders: createdOrder._id.toString()}})
    .then(() => {
        res.status(201).json({
          message: 'order added',
          order: {
            ...createdOrder,
            id: createdOrder._id
          }
        });
      })
    })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Creating an order failed!'
    });
  });
};

exports.updateOrder = (req, res, next) => {
  const order = new Order({
    _id: req.body.id,
    title: req.body.title,
    seller: req.body.seller,
    tracking: req.body.tracking,
    status: req.body.status,
    origin: req.body.origin,
    destination: req.body.destination,
    expectedDate: req.body.expectedDate,
    creator: req.userData.userId
  });
  Order.updateOne({ _id: req.params.id, creator: req.userData.userId },
    {$set: {title: order.title,
            seller: order.seller,
            tracking: order.tracking,
            status: order.status,
            origin: order.origin,
            destination: order.destination,
            expectedDate: order.expectedDate

  }}).then(result => {
  if (result.n > 0) {
    res.status(200).json({ message: "Updated succesfully!" });
  } else {
    res.status(401).json({ message: "Not authorized!" });
  }
})
.catch(error => {
  console.log(error);
  res.status(500).json({
    message: 'Could not update order!'
  });
});
};

exports.getOrders = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const orderQuery = Order.find();
  let fetchedOrders;
  if (pageSize && currentPage) {
    orderQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  orderQuery.then(documents => {
    fetchedOrders = documents;
    return Order.countDocuments();
  })
  .then(count => {
    res.status(200).json({
      message: 'orders fetched succesfully',
      orders: fetchedOrders,
      maxOrders: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching orders failed!'
    });
  });
};

exports.getOrder = (req, res, next) => {
  Order.findById(req.params.id).then(order => {
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({message: 'Order not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching order failed!'
    });
  });
};

exports.deleteOrder = (req, res, next) => {
  Order.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then(result => {
    User.updateOne(
      {_id: req.userData.userId},
      {$pull: {orders: req.params.id}})
      .then(() => {
        if (result.n > 0) {
          res.status(200).json({ message: "Deleted succesfully!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Fetching orders failed!'
    });
  });
};
