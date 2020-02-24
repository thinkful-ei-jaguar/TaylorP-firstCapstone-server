const express = require('express')
const CabinetService = require('./cabinet-services')
const { requireAuth } = require('../middleware/jwt-auth')
const spiritsRouter = express.Router()
const bodyParser = express.json()

spiritsRouter
  .route('/:user_id')
  .all(requireAuth)
  .get((req, res, next)=>{
    const { user_id } = req.params
    CabinetService.getAllSpiritsInCabinet(req.app.get('db'), user_id)
    .then(spirits => {
      res
        .status(200)
        .json(spirits)
    })
    .catch(next)
  })
  .post(bodyParser, (req, res, next)=>{
    const { user_id, spirit_name, spirit_id } = req.body
    const newSpirit = { spirit_name, spirit_id, user_id }

    if(spirit_name == null)
      return res.status(400).json({ error: `Missing 'Spirit Name' in request body`})
    
    CabinetService.addSpirit(
      req.app.get('db'),
      newSpirit
    )
      .then(spirit => {
        res
          .status(201)
          .json(CabinetService.serializeSpirit(spirit))
      })
      .catch(next)
  })
  .delete(bodyParser, (req, res, next) => {
    //const { user_id } = req.params
    const { id } = req.body

    CabinetService.deleteSpirit(
      req.app.get('db'),
      id
    )
      .then(()=>{
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = spiritsRouter