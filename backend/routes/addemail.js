import express from "express";
import { db } from "../server.js";
import multer from "multer";

const router = express.Router();

// Configure Multer to store file in memory (RAM) temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* ================= ADD EMAIL (SINGLE OR BULK) ================= */
// We use upload.single('file') middleware. It processes the file if present.
router.post('/addemail', upload.single('file'), async (req, res) => {
  const { name, email } = req.body; // 'name' comes from text input, 'email' from single input

  try {
    // === CASE 1: BULK UPLOAD (File is present) ===
    if (req.file) {
      if (!name) {
        return res.status(400).json({ message: "Folder Name is required for bulk upload" });
      }

      // 1. Convert buffer to string
      const fileContent = req.file.buffer.toString('utf8');

      // 2. Extract emails using Regex
      // This regex finds standard email patterns globally in the text
      const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
      const extractedEmails = fileContent.match(emailRegex);

      if (!extractedEmails || extractedEmails.length === 0) {
        return res.status(400).json({ message: "No valid emails found in the file." });
      }

      // 3. Prepare Data for Bulk Insert
      // Format: [[name, email1], [name, email2], [name, email3]]
      const values = extractedEmails.map(email => [name, email]);

      // 4. Bulk Insert SQL
      const sql = "INSERT INTO emails (name, email) VALUES ?";
      
      db.query(sql, [values], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error during bulk insert" });
        }
        res.json({ 
          message: `Successfully added ${result.affectedRows} emails from file.`,
          count: result.affectedRows 
        });
      });

    } 
    // === CASE 2: SINGLE ENTRY (No file) ===
    else {
      if (!name || !email) {
        return res.status(400).json({ message: "Missing name or email fields" });
      }

      const sql = "INSERT INTO emails (name, email) VALUES (?, ?)";
      db.query(sql, [name, email], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Email added successfully" });
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;