begin;

truncate
  recipes,
  spirits,
  spirit_type,
  linus_user,
  favorites
  restart identity cascade;

insert into linus_user (user_name, nickname, password)
values
  ('tpic12', 'Taylor', '$2a$10$6CulGUuKcN5UqENKc2t6eOoE3.ssfIbOf6FAk1pTV3M25M43498oy'),
  ('dunder', 'Mr. Mifflin', '$2a$10$ABvyr5cFtOpsxp7ZAaQDLOLsqBwdpz.woWKMriY1iZIvCFgOa8tNe'),
  ('f.bar', 'Foo', '$2a$10$q3V1xT0aWm1S7MxsPCo8mewHw79bB/q/aUC.2N5UhHMfd9ZBHccQa');

  insert into spirit_type (spirit_cat)
  values
    ('Tequila'),
    ('Vodka'),
    ('Gin'), --3
    ('Bourbon'),
    ('Scotch'), --5
    ('Amaro'),
    ('Rye'), --7
    ('Cognac'),
    ('Rum'); --9
    

insert into spirits (spirit_name, spirit_id, user_id)
values
  ('espolon', 1, 1),
  ('montenegro', 6, 1),
  ('fernet Branca', 6, 2),
  ('rittenhouse Rye', 7, 2),
  ('espolon', 1, 3),
  ('cimmaron', 1, 3),
  ('svedka', 2, 2),
  ('monkey Shoulder', 5, 1);

insert into recipes (recipe_name, recipe_img, recipe_ingredients, recipe_prep, spirit_id, tags)
values
  ('Margarita', 'no img', '2oz Tequila,1oz Lime Juice,.75 Agave Simple', 'Combine all ingredients in a shaker with ice and shake away. Optional garnish with salt rim. Serve on the rocks or up. Enjoy!', 1, null),
  ('Manhattan', 'no img', '2oz Bourbon,1oz Sweet Vermouth,Ango bitters', 'Combine all ingredients in shaker or mixing glass, stir until properly chilled, strain over fresh rocks or serve up. Enjoy!', 4, null),
  ('Old Fashioned', 'no img', '2oz Bourbon,.5oz Demerrara,Orange Bitters', 'Pour Bourbon into rocks glass, then add Demerarra, bitters, and ice. Stir until chilled, Zest rim with orange rind then garnish. Enjoy!', 4, null),
  ('Gin Martini', 'no img', '3oz Gin,.75oz Dry Vermouth or Olive Juice*', 'Combine all ingredients in a mixing glass ice and stir until chilled. *Use Dry Vermouth for Dry Martinis, or use Olive Juice for Dirty Martinis* Enjoy!', 3, null),
  ('Negroni', 'no img', '1oz Gin,1oz Sweet Vermouth,1oz Campari,Orange Bitters', 'Pour all ingrdients into rocks glass, then add bitters, and ice. Stir until chilled, Zest rim with orange rind then garnish. Enjoy!', 3, null),
  ('Vodka Martini', 'no img', '3oz Vodka,.75oz Dry Vermouth or Olive Juice*', 'Combine all ingredients in a mixing glass ice and stir until chilled. *Use Dry Vermouth for Dry Martinis, or use Olive Juice for Dirty Martinis* Enjoy!', 2, null),
  ('Last Word', 'no img', '.75oz Gin,.75oz Green Chartreuse,.75oz Maraschino Liquor,.75oz Lime Juice', 'Combine all ingredients in a shaker. Shake with ice and strain into a cocktail glass, serve up. Enjoy!', 3, null),
  ('Penicillin', 'no img', '2oz Blended Scotch,.75oz Honey Ginger Syrup,.25oz Islay Malt Scotch,.75oz Lemon Juice,Candied Ginger for garnsih', 'Combine Blended Scotch, Lemon Juice, syrup into shaker with ice, pour over fresh rocks in rocks glass. Top with Islay Malt scotch and garnish with Candied Ginger. Enjoy!', 5, null),
  ('Paloma', 'no img', '2oz Tequila,.25oz Lime Juice,.5oz Grapefruit Juice,Soda Water', 'Combine Tequila, and fruit juices in shaker with ice. Shake, and serve in highball glass, top with Soda Water and garnish with grapfruit wedge, salt rim optional. Enjoy!', 1, null),
  ('Tom Collins', 'no img', '2oz Gin,.75oz Lemon Juice,.5oz Simple Syrup,Soda Water', 'Combine Gin and Lemon Juice in shaker with ice. Shake, and serve in highball glass, top with Soda Water and garnish with Lemon wedge. Enjoy!', 3, null),
  ('My Old Pal', 'no img', '1oz Rye Whiskey,1oz Dry Vermouth,1oz Campari,Ango Bitters', 'Combine all ingredients in mixing glass, stir until chilled. Serve up in cocktail glass and garnish with lemon twist. Enjoy!', 7, null),
  ('Boulevardier', 'no img', '1oz Bourbon,1oz Sweet Vermouth,1oz Campari,Orange Bitters', 'Combine all ingredients in mixing glass, stir until chilled. Serve over fresh rocks in rocks glass and garnish with orange twist. Enjoy!', 4, null),
  ('Corpse Reviver No. 2', 'no img', '1oz Gin,1oz Lillet Blanc,1oz Lemon Juice,1oz Cointreau or Triple Sec,Dash of Absinthe', 'Combine all ingredients in a shaker with ice. Serve up in a cocktail glass and garnish with orange twist. Enjoy!', 3, null),
  ('Mojito', 'no img', '1.5oz White Rum,.5oz Simple Syrup,.5oz Lime Juice,Freh Mint,Soda Water', 'First muddle Mint Sprigs (saving at least one or garnish) in a shaker with the Simple Syrup. Combine Rum and Lime Juice in the shaker with ice. Serve in a highball glass and top with Soda Water, garnish with Mint Sprig. Enjoy!', 9, null),
  ('Aviation', 'no img', '2oz Gin,1oz Lemon Juice,.25oz Maraschino Liquor,.25oz Creme de Violette', 'Compine all ingredients in a shaker with ice, shake. Serve up in a coktail glass. Enjoy!', 3, null),
  ('Moscow Mule', 'no img', '1.5oz Vodka,.5oz Lime Juice,Ginger Beer(NA)', 'Add Vodka and Lime Juice to copper mug or highball glass filled with ice, stir in lime juice and garnish with lime wedge. Enjoy!', 2, null),
  ('Cosmopolitan', 'no img', '1.5oz Vodka,.75oz Cranberry Juice,.5oz Lime Juice,.5oz Cointreau or Triple Sec', 'Combine all ingredients in shaker with ice, shake. Serve up in cocktail glass, garnish with lime wedge or twist. Enjoy!', 2, null),
  ('Sazerac', 'no img', '1.5oz Rye Whiskey,.25oz Absinthe,Peychaud''s Bitters', 'First, rinse coktail glass in absinthe. Combine the Rye and bitters in mixing glass and sitr until chilled. Discard absinthe used to rinse glass, and serve the chilled mixture. Serve up with a lemon twist. Enjoy!', 7, null),
  ('Side Car', 'no img', '2oz Cognac,.75oz Lemon Juice,.75oz Cointreau or Triple Sec', 'Combine all ingredients in shaker with ice, shake. Serve up with a lemon twist, optional sugar rim. Enjoy!', 8, null),
  ('Whiskey Sour', 'no img', '2oz Bourbon,.75oz Lemon Juice,.5oz Simple Syrup,1 Egg White, Ango Bitters', 'Combine all ingredients, except bitters, in shaker with ice, shake. Serve up or on the rocks in appropriate glass, garnish with 3 dashes Ango Bitters. Enjoy!', 4, null),
  ('Daiquiri', 'no img', '1.5oz White Rum,1oz Lime Juice,.5oz Simple Syrup', 'Combine all ingredients in shaker with ice, shake. Serve up in a cocktail glass, garnish with lime twist. Enjoy!', 9, null),
  ('Cuba Libre', 'no img', '2oz White Rum,.5oz Lime Juice,5oz Coca-Cola', 'Pour Rum and Lime Juice into a highball glass with ice. Top off with Coca-Cola, and garnish with lime. Enjoy!', 9, null),
  ('Bee''s Knees', 'no img', '2oz Gin,.75oz Lemon Juice,.75oz Honey Simple', 'Combine all ingredients ina shaker with ice, shake. Serve up in cocktail glass with lemon twist for garnish. Enjoy!', 3, null),
  ('Vodka Gimlet', 'no img', '2.5oz Vodka,.5oz Lime Juice,.5oz Simple Syrup', 'Combine all ingredients ina shaker with ice, shake. Serve up or on the rocks in approprate glass with lime wheel for garnish. Enjoy!', 2, null),
  ('Gin Gimlet', 'no img', '2.5oz Gin,.5oz Lime Juice,.5oz Simple Syrup', 'Combine all ingredients ina shaker with ice, shake. Serve up or on the rocks in approprate glass with lime wheel for garnish. Enjoy!', 3, null)
  ;

  insert into favorites (recipe_id, user_id)
  values
  (3, 1),
  (1, 2),
  (1, 1),
  (4, 3);

  commit;