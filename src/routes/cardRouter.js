
import express from "express"
import * as cardService from "../services/cardService"

const router = express.Router()



router.get("/workers", async function(req, res) {
  const workers = await cardService.importWorkers()
  console.log("bdinaaasdvxbjkhvbkjhsjgdbfkjshg")
  res.json(workers)
})

router.get("/buildings", async function(req, res) {
  const buildings = await cardService.importBuildings()
  res.json(buildings)
})

export default router