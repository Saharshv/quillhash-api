DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    id SERIAL primary key,
    name text,
    email text,
    password text,
    likes integer[] DEFAULT '{}',
    blocked integer[] DEFAULT '{}',
    image text DEFAULT 'Image'
);

INSERT INTO Users (name, email, password, likes, blocked, image) VALUES ('user1', 'user1@a.com', 'password', '{}', '{}', 'Image'), ('user2', 'user2@a.com', 'password', '{}', '{}', 'Image');