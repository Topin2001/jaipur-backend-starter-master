/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import express from "express"
import * as gameService from "../services/gameService"
import * as db from "../database"
import fs from "fs"
import path from "path"

const DATABASE_FILE = path.join(__dirname, "../../storage/database.json")


const router = express.Router()

// Ecoute la requête POST /games.
router.post("/", (req, res) => {
  // TODO retourner le status 404 si le nom n'existe pas
  if (!req.body.name) return res.status(400).send("Not found")

  const newGame = gameService.createGame(req.body.name)
  db.saveGame(newGame)

  res.status(201).json({ id: newGame.id, name: newGame.name })
})

router.get("/", (req, res) => {
  // TODO retourner la liste des parties existantes

  const gameList = db.getGames().map((elt) => ({ id: elt.id, name: elt.name }))
  res.status(201).json(gameList)
})

router.delete("/:gameId", (req, res) => {
  if (!Number.isInteger(parseInt(req.params.gameId))) return res.status(404).send("Please insert a number")

  let gameList = db.getGames();

  let gameIndex = gameList.findIndex((g) => g.id == req.params.gameId)

  if (gameIndex >= 0) gameList.splice(gameIndex, 1);
  else return res.status(404).send("Game not found")
//  console.log(gameList)

  try {
    fs.rmSync(DATABASE_FILE)
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(gameList))
  } catch (e) {
    console.log(e)
  }
  return res.status(200).send("Game DELETED")
})

export default router
