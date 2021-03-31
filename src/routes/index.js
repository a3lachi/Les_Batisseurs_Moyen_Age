import healthRouter from "./healthRouter"
import gameRouter from "./gameRouter"
import cardRouter from "./cardRouter"
import express from "express"

const router = express.Router()

router.use("/health", healthRouter)
router.use("/games", gameRouter)
router.use("/cards", cardRouter)


export default router
