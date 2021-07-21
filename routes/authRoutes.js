const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/signup', authController.signup_get);

router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

router.get("/", authController.home_get);

router.get("/users", authController.users_get);
  
router.get("/about", authController.about_get);

router.get("/profile", requireAuth, authController.profile_get);

router.put("/profile", requireAuth, authController.profile_put);

module.exports =  router;