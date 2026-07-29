const express = require("express");
const router = express.Router();

const transaksiController = require("../controllers/transaksiController");

router.get("/", transaksiController.getAllTransaksi);
router.post("/", transaksiController.createTransaksi);
router.put("/:id", transaksiController.updateTransaksi);
router.patch("/:id/status", transaksiController.updateStatus);
router.delete("/:id", transaksiController.deleteTransaksi);

module.exports = router;
