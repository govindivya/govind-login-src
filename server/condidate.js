const router = require("express").Router();
const User = require("./Models/user");

router.post("/create", async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    let userfound = false;
    for (let i = 0; i < user.condidates.length; i++) {
      if (user.condidates[i].email === req.body.email) {
        userfound = true;
        break;
      }
    }
    if (userfound) {
      res.status(409).json({ success: false, error: "User already is list" });
    } else {
      user.condidates.push(req.body);
      await user.save();
      const condidates = user.condidates;
      res.status(201).json({ success: true, condidates });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/detail", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    let userExist = false;
    let condidateFound = null;
    for (let i = 0; i < user.condidates.length; i++) {
      if (user.condidates[i].email === req.body.email) {
        condidateFound={
          name:user.condidates[i].name,
          email:user.condidates[i].email,
          dob:user.condidates[i].dob,
          adress:user.condidates[i].adress,
          state:user.condidates[i].state,
          status:user.condidates[i].status,
          pincode:user.condidates[i].pincode,
          age:user.condidates[i].age
        }
        userExist = true;
        break;
      }
    }
    if (userExist) {
      res.status(200).json({ success: true,condidate: condidateFound });
    } else {
      res.status(404).json({ success: false,error:"Condidate not found !" });
  }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/*************************************************** */
router.put("/update", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let index = -1;
    for (let i = 0; i < user.condidates.length; i++) {
      if (user.condidates[i].email === req.body.email) {
        user.condidates[i] = { ...req.body };
        index = i;
        break;
      }
    }
    if (index === -1) {
      res.status(404).json({ success: false, error: "Email cant't be modified. You can modify other fields." });
    } else {
      await user.save();
      const condidates = user.condidates;
      res.status(201).json({ success: true, condidates });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*************************************************** */

router.delete("/:email", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let index = -1;

    for (let i = 0; i < user.condidates.length; i++) {
      if (user.condidates[i].email === req.params.email) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      res.status(200).json({ success: true });
    } else {
      user.condidates.splice(index, 1);
      await user.save();
      const condidates = user.condidates;
      res.status(200).json({ success: true, condidates });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/*************************************************** */

router.get("/get/all", async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const condidates = user.condidates;
    res.status(200).json({ success: true, condidates });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
