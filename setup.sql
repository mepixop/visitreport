create database visitReport;

use visitReport;

create table user(
    id integer auto_increment primary key,
    username varchar(50),
    password varchar(50)
);

insert into user(username, password) values ('admin','password');