const express = require("express");
const router = express.Router();
const DatabaseController = require("../controllers/CreateDatabaseController");

router.post("/create", async (req, res) => {
  DatabaseController.createDatabase(res, req.body.database);
});

router.post("/create-table-users", async (req, res) => {
  DatabaseController.createUserstable(res);
});

router.post("/update-table", async (req, res) => {
  DatabaseController.addNewTableRow(req.body.table, req.body.row, res);
});

module.exports.router = router;
