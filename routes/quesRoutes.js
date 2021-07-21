const { Router } = require('express');
const quesController = require('../controllers/quesController');
const { requireAuth, postOwnershipAuth } = require('../middleware/authMiddleware');

const router = Router();

router.post("/addpost", quesController.addpost_post);

router.get("/addpost", requireAuth, quesController.addpost_get);

router.get("/posts/:id", postOwnershipAuth, quesController.show);

router.get("/posts/:id/edit", postOwnershipAuth, quesController.edit_get);

router.put("/posts/:id/edit", postOwnershipAuth, quesController.edit_put);

router.delete("/posts/:id", postOwnershipAuth, quesController.post_delete);

module.exports =  router;
