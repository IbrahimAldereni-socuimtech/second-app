import User from "../models/userModel.js";

export const getUsers = (req, res) => {
  User.findAll().then((data) => {
    res.send(data);
  });
};

export const addUser = (req, res) => {
  const userInfo = {
    name: req.body.name,
    email: req.body.email,
  };

  User.create(userInfo)
    .then((response) => {
      res.send("user added successfully");
    })
    .catch((err) => {
      res.send("error adding user");
    });
};

export const getSingleUser = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((data) => {
      // this if statement cuz if the id is not found it will return null
      if (data) {
        res.send(data);
      } else {
        res.send("user not found");
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

export const deleteUser = (req, res) => {
  const userId = req.params.id;

  User.destroy({ where: { id: userId } })
    .then((response) => {
      // this if statement cuz if the id is not found it will return null
      if (response) {
        res.send("user deleted");
      } else {
        res.send("user not found");
      }
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const updateUser = (req, res) => {
  const userId = req.params.id;

  const newName = req.body.name;
  const newEmail = req.body.email;

  User.findByPk(userId)
    // this if statement cuz if the id is not found it will return null
    .then((data) => {
      if (data) {
        data.name = newName;
        data.email = newEmail;

        return data.save();
      } else {
        return Promise.resolve("user not found");
      }
    })
    .then((response) => {
      // if the id found it will return the updated object otherwise it will return "user not found"
      res.send(response);
    })
    .catch((err) => {
      res.send("error");
    });
};
