const { Router } = require('express');
const ansController = require('../controllers/ansController');
const { requireAuth, postOwnershipAuth } = require('../middleware/authMiddleware');

const router = Router();

router.put("/posts/:id", requireAuth, postOwnershipAuth, ansController.ans_put);

router.get("/posts/:id/:id2/edit", postOwnershipAuth, ansController.ans_edit_get);

router.put("/posts/:id/:id2/edit", postOwnershipAuth, ansController.ans_edit_put);

router.put("/posts/:id/:id2/delete", postOwnershipAuth, ansController.ans_delete);

//votes
router.get('/votes/upvote/:question/:answer', requireAuth, ansController.upvote);
router.get('/votes/downvote/:question/:answer', requireAuth, ansController.downvote);
router.get('/votes/unvote/:question/:answer', requireAuth, ansController.unvote);

module.exports =  router;
