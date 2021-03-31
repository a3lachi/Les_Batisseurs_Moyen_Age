// /health
import express from "express"
const router = express.Router()

router.get("/", function(req, res) {
  res.json({ health: "ok" })
})

export default router
