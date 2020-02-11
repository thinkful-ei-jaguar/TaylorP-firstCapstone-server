begin;

truncate
  recipes,
  spirits,
  spirit_type,
  linus_user
  restart identity cascade;

insert into linus_user (user_name, nickname, password)
values
  ('tpic12', 'Taylor', 'password1'),
  ('dunder', 'Mr. Mifflin', 'password2'),
  ('f.bar', 'Foo', 'password');

  insert into spirit_type (spirit_cat)
  values
    ('Tequila'),
    ('Vodka'),
    ('Gin'),
    ('Bourbon'),
    ('Scotch'),
    ('Amaro'),
    ('Rye');

insert into spirits (spirit_name, spirit_id, spirit_img, user_id)
values
  ('Espolon', 1, null, 1),
  ('Montenegro', 6, null, 1),
  ('Fernet Branca', 6, null, 2),
  ('Rittenhouse Rye', 7, null, 2),
  ('Espolon', 1, null, 3),
  ('Cimmaron', 1, null, 3),
  ('Svedka', 2, null, 2),
  ('Monkey Shoulder', 5, null, 1);

insert into recipes (recipe_name, recipe_img, recipe_ingredients, recipe_prep, favorited, spirit_id, tags)
values
  ('Margarita', 'no img', '2oz Tequila,1oz Lime Juice,.75 Agave Simple', 'Combine all ingredients in a shaker with ice and shake away. Optional garnish with salt rim. Serve on the rocks or up. Enjoy!', 'false', 1, null),
  ('Manhattan', 'no img', '2oz Bourbon,1oz Sweet Vermouth,Ango bitters', 'Combine all ingredients in shaker or mixing glass, stir until properly chilled, strain over fresh rocks or serve up. Enjoy!', 'false', 4, null),
  ('Old Fashioned', 'no img', '2oz Bourbon,.5oz Demerrara,Orange Bitters', 'Pour Bourbon into rocks glass, then add Demerarra, bitters, and ice. Stir until chilled, Zest rim with orange rind then garnish. Enjoy!', 'false', 4, null),
  ('Gin Martini', 'no img', '3oz Gin,.75oz Dry Vermouth or Olive Juice*', 'Combine all ingredients in a mixing glass ice and stir until chilled. *Use Dry Vermouth for Dry Martinis, or use Olive Juice for Dirty Martinis* Enjoy!', 'false', 3, null);

  commit;