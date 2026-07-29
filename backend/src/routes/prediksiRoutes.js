const express = require("express");
const router = express.Router();

const prediksiController = require("../controllers/prediksiController");

router.post("/", prediksiController.runPrediksi);

module.exports = router;
