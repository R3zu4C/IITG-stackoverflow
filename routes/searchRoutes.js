const { Router } = require('express');
const searchController = require('../controllers/searchController');

const router = Router();

router.post("/search", searchController.search_post);

router.get("/search/:query", searchController.search_get);
  
module.exports = router;
