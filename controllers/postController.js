import Post from "../models/postModel.js";

export const getPosts = (req, res) => {
  Post.findAll().then((data) => {
    res.send(data);
  });
};

export const addPost = (req, res) => {
  const postInfo = {
    title: req.body.title,
    body: req.body.body,
    userId: req.body.userId,
  };

  Post.create(postInfo)
    .then((response) => {
      res.send("post added successfully");
    })
    .catch((err) => {
      res.send("error");
    });
};

export const getSinglePost = (req, res) => {
  const postId = req.params.id;

  Post.findByPk(postId)
    .then((data) => {
      // this if statement cuz if the id is not found it will return null
      if (data) {
        res.send(data);
      } else {
        res.send("post not found");
      }
    })
    .catch((err) => {
      res.send("error");
    });
};

export const deletePost = (req, res) => {
  const postId = req.params.id;

  Post.destroy({ where: { id: postId } })
    .then((response) => {
      // this if statement cuz if the id is not found it will return null
      if (response) {
        res.send("post deleted");
      } else {
        res.send("post not found");
      }
    })
    .catch((err) => {
      res.send("error");
    });
};

export const updatePost = (req, res) => {
  const postId = req.params.id;

  const newTitle = req.body.title;
  const newBody = req.body.body;

  Post.findByPk(postId)
    // this if statement cuz if the id is not found it will return null
    .then((data) => {
      if (data) {
        data.title = newTitle;
        data.body = newBody;

        return data.save();
      } else {
        return Promise.resolve("post not found");
      }
    })
    .then((response) => {
      // if the id found it will return the updated object otherwise it will return "post not found"
      res.send(response);
    })
    .catch((err) => {
      res.send("error");
    });
};
