const express = require('express');
const router = express.Router();
const summarizer = require("../controllers/summarizer");

router.post('/generate-summary', summarizer.generateSummary);

router.post('/generate-pdf', summarizer.generatePDF);

module.exports = router;
