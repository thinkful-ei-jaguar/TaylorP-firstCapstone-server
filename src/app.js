require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helemt = require("helmet");
const { NODE_ENV } = require("./config");
const cabinetRouter = require("./cabinet/cabinet-router");
const RecipesRouter = require("./recipes/recipes-router");
const AuthRouter = require("./auth/auth-router");
const UserRouter = require("./user/user-router");
const FavoritesRouter = require("./favorites/favorites-router");
const UserRecipesRouter = require("./user_recipes/user_recipes-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(
  morgan(morganOption, {
    skip: () => NODE_ENV === "test",
  })
);

const corsOptions = {
  origin: "https://linus-ten.now.sh/",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(helemt());

app.use("/cabinet", cabinetRouter);
app.use("/recipes", RecipesRouter);
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/favorites", FavoritesRouter);
app.use("/user-recipes", UserRecipesRouter);

app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "Internal Service Error" };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
