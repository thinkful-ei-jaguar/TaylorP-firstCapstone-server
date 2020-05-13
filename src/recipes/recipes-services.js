//const xss = require('xss')

const RecipesService = {
  getAllRecipes(db) {
    return db
      .select(
        "recipes.id",
        "recipes.recipe_name",
        "recipes.recipe_img",
        "recipes.recipe_ingredients",
        "recipes.recipe_prep",
        "spirit_type.spirit_cat"
      )
      .from("recipes")
      .join("spirit_type", "recipes.spirit_id", "spirit_type.id");
  },

  getRecipeBySpirit(db, type) {
    return db
      .select(
        "recipes.id",
        "recipes.recipe_name",
        "recipes.recipe_img",
        "recipes.recipe_ingredients",
        "recipes.recipe_prep",
        "spirit_type.spirit_cat"
      )
      .from("recipes")
      .join("spirit_type", "recipes.spirit_id", "spirit_type.id")
      .where("spirit_cat", type);
  },

  getRecipeByName(db, name) {
    return db
      .select(
        "recipes.id",
        "recipes.recipe_name",
        "recipes.recipe_img",
        "recipes.recipe_ingredients",
        "recipes.recipe_prep",
        "spirit_type.spirit_cat"
      )
      .from("recipes")
      .join("spirit_type", "recipes.spirit_id", "spirit_type.id")
      .where(db.raw(`LOWER(recipe_name) LIKE LOWER('%${name}%')`));
  },

  getRecipeBySpiritAndName(db, name, type) {
    return db
      .select(
        "recipes.id",
        "recipes.recipe_name",
        "recipes.recipe_img",
        "recipes.recipe_ingredients",
        "recipes.recipe_prep",
        "spirit_type.spirit_cat"
      )
      .from("recipes")
      .join("spirit_type", "recipes.spirit_id", "spirit_type.id")
      .where(
        db.raw(`spirit_cat = '${type}'
      and LOWER(recipe_name) like LOWER('%${name}%')`)
      );
  },

  getById(db, id) {
    return db.select("*").from("recipes").where("id", id).first();
  },

  getUserRceipeById(db, user_id, id) {
    return db
      .select("*")
      .from("user_recipes")
      .where(
        db.raw(`user_recipes.user_id=${user_id}
      and user_recipes.id=${id}`)
      )
      .first();
  },

  postNewRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into("user_recipes")
      .returning("*")
      .then(([recipe]) => recipe);
  },

  deleteUserRecipe(db, user_id, id) {
    return db("user_recipes")
      .where(
        db.raw(`user_id=${user_id}
        and id=${id}`)
      )
      .delete();
  },

  getUsermadeRecipesByUserId(db, user_id) {
    return db
      .select(
        "user_recipes.id",
        "user_recipes.recipe_name",
        "user_recipes.recipe_img",
        "user_recipes.recipe_ingredients",
        "recipe_prep",
        "spirit_type.spirit_cat"
      )
      .from("user_recipes")
      .join("spirit_type", "user_recipes.spirit_id", "spirit_type.id")
      .where({ user_id });
  },
};

module.exports = RecipesService;
