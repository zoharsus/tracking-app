const Post = require('../models/post');
const User = require('../models/user');

exports.createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    seller: req.body.seller,
    tracking: req.body.tracking,
    status: req.body.status,
    origin: req.body.origin,
    destination: req.body.destination,
    expectedDate: req.body.expectedDate,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    User.updateOne(
      {_id: req.userData.userId},
      {$addToSet: {orders: createdPost._id.toString()}})
    .then(() => {
        res.status(201).json({
          message: 'post added',
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      })
    })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
};

exports.updatePost = (req, res, next) => {
  const post = new Post({
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
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
  if (result.n > 0) {
    res.status(200).json({ message: "Updated succesfully!" });
  } else {
    res.status(401).json({ message: "Not authorized!" });
  }
})
.catch(error => {
  console.log(error);
  res.status(500).json({
    message: 'Could not update post!'
  });
});
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.countDocuments();
  })
  .then(count => {
    res.status(200).json({
      message: 'posts fetched succesfully',
      posts: fetchedPosts,
      maxPosts: count
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Fetching posts failed!'
    });
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching post failed!'
    });
  });
};

// exports.getPostTrack = (req, res, next) => {
//   Post.find({tracking: req.params.tracking}).then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({message: 'Post not found!'});
//     }
//   }).catch(error => {
//     res.status(500).json({
//       message: 'Fetching post failed!'
//     });
//   });
// };

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
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
        message: 'Fetching posts failed!'
    });
  });
};
