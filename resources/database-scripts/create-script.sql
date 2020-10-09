CREATE DATABASE getlab;
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(25),
  lastName varchar(25)
);

CREATE TABLE universities (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(50),
  shortName varchar(10),
  userId int,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE faculties (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(50),
  shortName varchar(10),
  universityId int,
  FOREIGN KEY (universityId) REFERENCES universities(id)
);

CREATE TABLE groups (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(50),
  shortName varchar(10),
  facultyId int,
  FOREIGN KEY (facultyId) REFERENCES faculties(id)
);