const express = require('express')
const FavoritesService = require('./favorites-services')
const { requireAuth } = require('../middleware/jwt-auth')

const favoritesRouter = express.Router()
bodyParser = express.json()

favoritesRouter
.route('/')
.all(requireAuth)
.post(bodyParser, (req, res, next)=>{
  const { user_id, recipe_id } = req.body;
  const newFavorite = { user_id, recipe_id }

  FavoritesService.postNewFavorite(req.app.get('db'), newFavorite)
  .then(post => {
    data = {
      favorite_id: post.id,
      id: post.recipe_id,
      user_id: post.user_id
    }
    res
      .status(201)
      .json(data)
  })
  .catch(next)
})
.delete(bodyParser, (req, res, next) => {
  const { user_id, recipe_id } = req.body;

  FavoritesService.deleteFavorite(
    req.app.get('db'),
    user_id,
    recipe_id
  )
  .then(()=>{
    res.status(204).end()
  })
  .catch(next)
})

favoritesRouter
.route('/:id')
.all(requireAuth)
.get((req,res,next)=>{
  const user_id = req.params.id
  FavoritesService.getAllFavorites(req.app.get('db'), user_id)
    .then(favs => {
      res
        .status(200)
        .json(favs)
    })
    .catch(next)
})

module.exports = favoritesRouter;