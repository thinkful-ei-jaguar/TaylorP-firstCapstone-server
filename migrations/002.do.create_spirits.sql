create table spirits (
  id integer primary key generated by default as identity,
  spirit_name text not null,
  spirit_id integer references spirit_type(id),
  spirit_img text
);