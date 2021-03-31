import express from "express"
import * as gameService from "../services/gameService"

const router = express.Router()


// curl -X POST "http://localhost:3000/games?numberOfPlayers=2&name=zzer"
router.post("/", async  function(req, res) {
   const vv =  await  gameService.createGame(req.param('numberOfPlayers'), req.param('name')) 
   res.json("hee")
  
});

router.get("/", async function(req, res) {
    const vv = await gameService.findAllGames( req.param('name'),req.param('done'),req.param('id') )
    res.json(vv);
});

router.get("/:gameid", async function(req, res) {
    const vv =  await gameService.importSingleGameByid( req.param('gameid') )
    res.json(vv);
});

router.post("/:gameId/actions", async function(req, res) {
  console.log(req.body)
  if (req.body.payload) {
    const vv =  await gameService.playAction(req.param('gameId'),req.header('player-id'),req.body.type,req.body.payload.workerId,req.body.payload.buildingId,req.body.payload.numberOfActions) 
    res.json(vv)
  }
  else {
    const vv = await gameService.playAction(req.param('gameId'),req.header('player-id'),req.body.type)
    res.json(vv)
  }
  
  
});


//comment
export default router