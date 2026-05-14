const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue"); 


router.put("/:id/assign", async (req, res) => {
  try {
    const { workerId } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.assignedTo = workerId;
    issue.status = "In Progress";

    await issue.save();

    res.json({ message: "Issue assigned successfully", issue });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;

    await issue.save();

    res.json({ message: "Status updated successfully", issue });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put("/:id/close", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = "Resolved";
    issue.closedAt = new Date();

    await issue.save();

    res.json({ message: "Issue closed successfully", issue });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;