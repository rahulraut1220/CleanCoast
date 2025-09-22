const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getCertificates
} = require('../controllers/certificateController');

router.get('/certificates/:id', generateCertificate); // id = eventId
router.get('/certificates/user/:id', getCertificates); // id = userId

module.exports = router;
