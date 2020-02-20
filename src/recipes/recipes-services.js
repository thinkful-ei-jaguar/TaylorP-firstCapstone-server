//const xss = require('xss')

const RecipesService = {
  getAllRecipes(db) {
    return db
      .select(
        'recipes.id',
        'recipes.recipe_name',
        'recipes.recipe_ingredients',
        'recipes.recipe_prep',
        'recipes.favorited',
        'spirit_type.spirit_cat')
      .from('recipes')
      .join(
        'spirit_type',
        'recipes.spirit_id',
        'spirit_type.id'
      )
  },

  getRecipeBySpirit(db, type) {
    return db
      .select(
        'recipes.id',
        'recipes.recipe_name',
        'recipes.recipe_ingredients',
        'recipes.recipe_prep',
        'recipes.favorited',
        'spirit_type.spirit_cat')
      .from('recipes')
      .join(
        'spirit_type',
        'recipes.spirit_id',
        'spirit_type.id'
      )
      .where('spirit_cat', type)
  },

  getRecipeByName(db, name) {
    return db
      .select(
        'recipes.id',
        'recipes.recipe_name',
        'recipes.recipe_ingredients',
        'recipes.recipe_prep',
        'recipes.favorited'
        )
      .from('recipes')
      .where(
        db.raw(
          `LOWER(recipe_name) LIKE LOWER('%${name}%')`
        )
      )
  },

  getRecipeBySpiritAndName(db, name, type) {
    return db
      .select(
        'recipes.id',
        'recipes.recipe_name',
        'recipes.recipe_ingredients',
        'recipes.recipe_prep',
        'recipes.favorited',
        'spirit_type.spirit_cat')
      .from('recipes')
      .join(
        'spirit_type',
        'recipes.spirit_id',
        'spirit_type.id'
      )
      .where(
        db.raw(`spirit_cat = '${type}'
      and LOWER(recipe_name) like LOWER('%${name}%')`)
      )

  },

  getById(db, id) {
    return db
      .select('*')
      .from('recipes')
      .where('id', id)
      .first()
  }
}

module.exports = RecipesService