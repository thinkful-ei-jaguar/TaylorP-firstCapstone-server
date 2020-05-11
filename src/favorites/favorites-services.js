const FavoritesService = {
  getAllFavorites(db, id) {
    return db
      .select(
        "favorites.id AS favorite_id",
        "favorites.recipe_id AS id",
        "favorites.user_id",
        "recipes.recipe_name",
        "recipes.spirit_id",
        "recipes.recipe_img"
      )
      .from("favorites")
      .join("recipes", "favorites.recipe_id", "recipes.id")
      .where("favorites.user_id", id);
  },

  postNewFavorite(db, newFavorite) {
    return db
      .insert(newFavorite)
      .into("favorites")
      .returning("*")
      .then(([favorite]) => favorite);
  },

  deleteFavorite(db, user_id, recipe_id) {
    return db("favorites")
      .where(
        db.raw(`favorites.user_id=${user_id}
        and favorites.recipe_id=${recipe_id}`)
      )
      .delete();
  },
};

module.exports = FavoritesService;
