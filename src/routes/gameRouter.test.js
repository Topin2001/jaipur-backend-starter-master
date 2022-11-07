/* eslint-disable prettier/prettier */

import request from "supertest"
import app from "../app"
import lodash from "lodash"
import * as db from "../database"

// Prevent writing tests game to filesystem using src/database/__mocks__/index.js implementation
jest.mock("../database")

// Prevent shuffle for tests
jest.mock("lodash")
lodash.shuffle.mockImplementation((array) => array)

afterEach(() => {
  db.clear()
})

describe("Game router", () => {
  test("should create a game", async () => {
    const expectedGame = {
      id: 1,
      name: "test",
      market: ["camel", "camel", "camel", "diamonds", "diamonds"],
      _deck: [
        "silver",
        "silver",
        "silver",
        "silver",
        "silver",
        "silver",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "cloth",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "spice",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "leather",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
        "camel",
      ],
      _players: [
        {
          hand: ["diamonds", "diamonds", "diamonds", "diamonds", "gold"],
          camelsCount: 0,
          score: 0,
        },
        {
          hand: ["gold", "gold", "gold", "gold", "gold"],
          camelsCount: 0,
          score: 0,
        },
      ],
      currentPlayerIndex: 0,
      tokens: {
        diamonds: [7, 7, 5, 5, 5],
        gold: [6, 6, 5, 5, 5],
        silver: [5, 5, 5, 5, 5],
        cloth: [5, 3, 3, 2, 2, 1, 1],
        spice: [5, 3, 3, 2, 2, 1, 1],
        leather: [4, 3, 2, 1, 1, 1, 1, 1, 1],
      },
      _bonusTokens: {
        3: [2, 1, 2, 3, 1, 2, 3],
        4: [4, 6, 6, 4, 5, 5],
        5: [8, 10, 9, 8, 10],
      },
      winnerId: undefined,
    }
    const response = await request(app).post("/games").send({ name: "test" })
    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual({
      id: 1,
      name: "test",
    })
    const games = db.getGames()
    expect(games.length).toBe(1)
    expect(games[0]).toStrictEqual(expectedGame)
  })

  test("should return 400 if name not provided", async () => {
    const response = await request(app).post("/games").send({})
    expect(response.statusCode).toBe(400)
  })

  test("should return 400 if name is empty", async () => {
    const response = await request(app).post("/games").send({ name: "" })
    expect(response.statusCode).toBe(400)
  })

})