CREATE DATABASE getlab;

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

CREATE TABLE users (
  id int AUTO_INCREMENT PRIMARY KEY,
  name varchar(25),
  role varchar(10),
  username varchar(25),
  password varchar(25),
  email varchar(30),
  phone varchar(15),
  refreshToken text
);