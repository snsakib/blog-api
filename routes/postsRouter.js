const express = require("express");

// Generic error handler function used by all endpoints
function errorHandler(res, reason, message, code) {
  console.log(`ERROR: ${reason}`);
  return res.status(code || 500).json({
    error: message
  });
}

// Declare all endpoints
function routes(Post) {
  const postsRouter = express.Router();

  // Middleware for finding a post by id
  postsRouter.use("/posts/:id", (req, res, next) => {
    Post.findById(req.params.id, (err, post) => {
      if (err) {
        return res.send(err);
      }
      if (post) {
        req.post = post;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  // Find all posts
  // Endpoint: "/api/posts"
  //
  // Fetch the title, updateData & timeToRead fields
  // for a specific category
  // Endpoint(as example): "/api/posts?categories=HTML"
  //
  // HTTP method: GET
  postsRouter.route("/posts").get((req, res) => {
    const { query } = req;

    if (query.categories) {
      Post.find(query, "title updateDate timeToRead", (err, posts) => {
        if (err) {
          return res.send(err);
        }
        if (!query) {
          return res.send("invalid search query.");
        }
        return res.json(posts);
      });
    } else {
      // Send all posts
      Post.find((err, posts) => {
        if (err) {
          return res.send(err);
        }
        return res.json(posts);
      });
    }
  });

  // Find a single post by id
  // endpoint: "/api/posts/:id"
  // HTTP method: GET
  postsRouter.route("/posts/:id").get((req, res) => {
    res.json(req.post);
  });

  // Fetch only the categories field of all posts
  // Endpoint: "/api/postsCategories"
  // HTTP method: GET
  postsRouter.route("/postsCategories").get((req, res) => {
    Post.find({}, "categories", (err, posts) => {
      if (err) {
        return res.send(err);
      }
      return res.json(posts);
    });
  });

  // Create a new post
  // endpoint: "/api/posts"
  // HTTP method: POST
  postsRouter.route("/posts").post((req, res) => {
    const post = new Post(req.body);
    post.save();
    return res.status(201).json(post);
  });

  // Update a full post
  // endpoint: "/api/posts/:id"
  // HTTP method: PUT
  postsRouter.route("/posts/:id").put((req, res) => {
    const { post } = req;
    post.title = req.body.title;
    post.timeToRead = req.body.timeToRead;
    post.content = req.body.content;
    post.author = req.body.author;
    req.post.save(err => {
      if (err) {
        return res.send(err);
      }
      return res.json(post);
    });
  });

  // Update a specific parts of a post
  // endpoint: "/api/posts/:id"
  // HTTP method: PATCH
  postsRouter.route("/posts/:id").patch((req, res) => {
    const { post } = req;

    if (req.body._id) {
      delete req.body._id;
    }

    Object.entries(req.body).forEach(item => {
      const key = item[0];
      const value = item[1];
      post[key] = value;
    });
    req.post.save(err => {
      if (err) {
        return res.send(err);
      }
      return res.json(post);
    });
  });

  // Delete a post
  // endpoint: "/api/posts/:id"
  // HTTP method: DELETE
  postsRouter.route("/posts/:id").delete((req, res) => {
    req.post.remove(err => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  });

  return postsRouter;
}

module.exports = routes;
