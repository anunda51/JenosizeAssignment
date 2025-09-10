const express = require("express");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// POST /api/campaigns
app.post(
  "/api/campaigns",
  [
    body("name").notEmpty().withMessage("Campaign name is required"),
    body("subject").notEmpty().withMessage("Subject line is required"),
    body("content").notEmpty().withMessage("Email content is required"),
    body("recipients")
      .isArray({ min: 1 })
      .withMessage("At least one recipient is required"),
    body("recipients.*")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email in recipients"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const campaignId = uuidv4();

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaignId,
    });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
