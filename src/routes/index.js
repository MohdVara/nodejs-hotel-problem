import express from 'express';
import {
  checkLink,
  booking
} from '../controllers/ApiController';
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Hotel Problem Solution API'
  });
});

/* API root link */
router.get('/api', checkLink);
router.post('/api/booking', booking);

export default router;