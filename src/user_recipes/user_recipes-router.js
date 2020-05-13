const express = require("express");
const RecipesService = require("../recipes/recipes-services");
const { requireAuth } = require("../middleware/jwt-auth");

const UserRecipesRouter = express.Router();
const bodyParser = express.json();

UserRecipesRouter.route("/:user_id")
  .all(requireAuth)
  .all((req, res, next) => {
    const { user_id } = req.params;
    RecipesService.getUsermadeRecipesByUserId(req.app.get("db"), user_id)
      .then((recipe) => {
        if (!recipe) {
          return res.status(200).end();
        }
        res.recipe = recipe;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    // const { user_id } = req.params;
    // RecipesService.getUsermadeRecipesByUserId(req.app.get("db"), user_id)
    //   .then((recipes) => {
    //     res.status(200).json(recipes);
    //   })
    //   .catch(next);
    res.json(res.recipe);
  })
  .post(bodyParser, (req, res, next) => {
    const { user_id } = req.params;
    const {
      recipe_name,
      recipe_img,
      recipe_ingredients,
      recipe_prep,
      spirit_id,
    } = req.body;
    const newRecipe = {
      recipe_name,
      recipe_img,
      recipe_ingredients,
      recipe_prep,
      spirit_id,
      user_id,
      tags: null,
    };

    RecipesService.postNewRecipe(req.app.get("db"), newRecipe).then((post) => {
      data = {
        id: post.id,
        recipe_name: post.recipe_name,
        user_id: post.user_id,
      };
      res.status(201).json(data);
    });
  });

module.exports = UserRecipesRouter;
