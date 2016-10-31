
CREATE TABLE "shows" ("id" serial8 primary key, "created_at" date, "name" varchar(255), "price" decimal);
INSERT INTO "shows" VALUES (1, '2015-08-23 20:09:41.969902', 'Le Haggis', 12.99);
INSERT INTO "shows" VALUES (2, '2015-08-23 20:09:41.972179', 'Shitfaced Shakespeare', 16.50);
INSERT INTO "shows" VALUES (3, '2015-08-23 20:09:41.972999', 'Camille O''Sullivan', 17.99);
INSERT INTO "shows" VALUES (4, '2015-08-23 20:09:41.971545', 'Game of Thrones - The Musical', 16.50);
INSERT INTO "shows" VALUES (5, '2015-08-23 20:09:41.975610', 'Paul Dabek Mischief ', 12.99);
INSERT INTO "shows" VALUES (6, '2015-08-23 20:09:41.979784', 'Joe Stilgoe: Songs on Film – The Sequel', 16.50);
INSERT INTO "shows" VALUES (7, '2015-08-23 20:09:41.981653', 'Aaabeduation – A Magic Show', 17.99);
INSERT INTO "shows" VALUES (8, '2015-08-23 20:09:41.983556', 'Edinburgh Royal Tattoo', 32.99);
INSERT INTO "shows" VALUES (9, '2015-08-23 20:09:41.987003', 'Best of Burlesque', 7.99);
INSERT INTO "shows" VALUES (10, '2015-08-23 20:09:41.989455', 'Two become One', 8.50);
INSERT INTO "shows" VALUES (11, '2015-08-23 20:09:41.991271', 'Urinetown', 8.50);
INSERT INTO "shows" VALUES (12, '2015-08-23 20:09:41.992358', 'Two girls, one cup of comedy', 6.00);
INSERT INTO "shows" VALUES (13, '2015-08-23 20:09:41.996721', 'Balletronics', 32.00);


CREATE TABLE "times" ("id" serial8 primary key, "time" varchar(255), "show_id" int2);
INSERT INTO "times" (time, show_id) VALUES ('13:30', 1);
INSERT INTO "times" (time, show_id) VALUES ('19:30', 2);
INSERT INTO "times" (time, show_id) VALUES ('17:15', 3);
INSERT INTO "times" (time, show_id) VALUES ('19:30', 4);
INSERT INTO "times" (time, show_id) VALUES ('12:45', 5);
INSERT INTO "times" (time, show_id) VALUES ('17:15', 6);
INSERT INTO "times" (time, show_id) VALUES ('12:45', 7);
INSERT INTO "times" (time, show_id) VALUES ('22:00', 8);
INSERT INTO "times" (time, show_id) VALUES ('19:30', 9);
INSERT INTO "times" (time, show_id) VALUES ('14:15', 10);
INSERT INTO "times" (time, show_id) VALUES ('20:00', 11);
INSERT INTO "times" (time, show_id) VALUES ('12:45', 12);
INSERT INTO "times" (time, show_id) VALUES ('20:00', 13);


CREATE TABLE "users" ("id" serial8 primary key, "name" varchar(255));
INSERT INTO "users" (name) VALUES ('Rick Henry'), ('Jay Chetty'), ('Keith Douglas'), ('Valerie Gibson');
INSERT INTO "users" (name) VALUES
('Steven Meiklejohn'),
('Zak Buys'),
('Harry Swan'),
('Henry Dashwood'),
('Seumus Blair'),
('David MacKintosh'),
('Allan Harrison'),
('Chris Wood'),
('Adam Pinner'),
('Jeffrey Lloyd'),
('Alistair MacKay'),
('Andrew Craib'),
('Rebecca Kelly'),
('Hamish Edmondson'),
('Wojciech Tartanus'),
('Donald Lessels'),
('Aidan Pinkman'),
('Lewis Johnston');


CREATE TABLE "shows_users" ("id" serial8 primary key, "show_id" int8, "user_id" int8);
INSERT INTO "shows_users" (show_id, user_id) VALUES (1, 1);
INSERT INTO "shows_users" (show_id, user_id) VALUES (1, 2);