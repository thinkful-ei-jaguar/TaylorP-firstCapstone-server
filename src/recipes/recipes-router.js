const express = require('express')
const RecipesService = require('./recipes-services')
const { requireAuth } = require('../middleware/jwt-auth')

const RecipesRouter = express.Router()

RecipesRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next)=>{
    let keyword;
    keyword = req.query.keyword;
    let filter;
    filter = req.query.filter;
    if(keyword === '' && filter === 'All'){
      RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
      res
        .status(200)
        .json(recipes)
      })  
      .catch(next)
    }
    else if(keyword === '' && filter !== 'All') {
      RecipesService.getRecipeBySpirit(req.app.get('db'), filter)
      .then(recipes => {
      res
        .status(200)
        .json(recipes)
      })  
      .catch(next)
    }
    else if(keyword !== '' && filter !== 'All') {
      RecipesService.getRecipeBySpiritAndName(req.app.get('db'), keyword, filter)
      .then(recipes => {
      res
        .status(200)
        .json(recipes)
      })  
      .catch(next)
    }
    else if(keyword !== '' && filter === 'All') {
      RecipesService.getRecipeByName(req.app.get('db'), keyword)
      .then(recipes => {
      res
        .status(200)
        .json(recipes)
      })  
      .catch(next)
    }
    
  }
  )

RecipesRouter
  .route('/:id')
  .all(requireAuth)
  .all((req, res, next)=>{
    const { id } = req.params
    RecipesService.getById(req.app.get('db'), id)
    .then(recipe => {
      if(!recipe) {
        return res
          .status(404)
          .json({error: 'Recipe Not Found'})
      }
      res.recipe = recipe
      next()
    })
    .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.recipe)
  })

module.exports = RecipesRouter