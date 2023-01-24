import express from 'express'
import { createHotel, deleteHotel, getAllHotel, getHotel, updateHotel } from '../controllers/hotel.js'
import { verifyAdmin } from '../utils/VerifyToken.js'


const router = express.Router()

// CREATE
router.post("/", verifyAdmin, verifyAdmin, createHotel)

// UPDATE
router.put("/:id", verifyAdmin, updateHotel)

// DELETE
router.delete("/:id", verifyAdmin, deleteHotel)

// GET
router.get("/:id", verifyAdmin, getHotel)

// GET ALL
router.get("/", verifyAdmin, getAllHotel)

export default router