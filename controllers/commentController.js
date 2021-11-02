import Comment from "../models/commentModel.js";

export const getComments = (req, res) => {
  Comment.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send("error");
    });
};

export const addComment = (req, res) => {
  const commentInfo = {
    name: req.body.name,
    body: req.body.body,
    postId: req.body.postId,
  };

  Comment.create(commentInfo)
    .then((response) => {
      res.status(201).send("comment added successfully");
    })
    .catch((err) => {
      res.status(500).send("error");
    });
};

export const getSingleComment = (req, res) => {
  const commentId = req.params.id;

  Comment.findByPk(commentId)
    .then((data) => {
      // this if statement cuz if the id is not found it will return null
      if (data) {
        res.send(data);
      } else {
        res.send("comment not found");
      }
    })
    .catch((err) => {
      res.status(500).send("error");
    });
};

export const deleteComment = (req, res) => {
  const commentId = req.params.id;

  Comment.destroy({ where: { id: commentId } })
    .then((response) => {
      // this if statement cuz if the id is not found it will return null
      if (response) {
        res.send("comment deleted");
      } else {
        res.send("comment not found");
      }
    })
    .catch((err) => {
      res.status(500).send("error");
    });
};

export const updateComment = (req, res) => {
  const commentId = req.params.id;

  const newName = req.body.name;
  const newBody = req.body.body;

  Comment.findByPk(commentId)
    // this if statement cuz if the id is not found it will return null
    .then((data) => {
      if (data) {
        data.name = newName;
        data.body = newBody;

        return data.save();
      } else {
        return Promise.resolve("comment not found");
      }
    })
    .then((response) => {
      // if the id found it will return the updated object otherwise it will return "comment not found"
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send("error");
    });
};
