create database visitReport;

use visitReport;

create table if not exists user(
    id integer auto_increment primary key,
    username varchar(50) not null,
    password varchar(50) not null
);

insert into user(username, password) values ('admin','password');

create table if not exists visitReport(
    id integer auto_increment primary key,
    status varchar(25) not null,
    assignedTo integer not null,
    topic varchar(150) not null,
    type varchar(25) not null,
    startTime datetime not null,
    endTime datetime not null,
    outcome varchar(25) not null,
    notes varchar(300) not null,
    followUp varchar(300) not null,
    foreign key (assignedTo) references user(id)
);

create table if not exists contact(
    id integer auto_increment primary key,
    name varchar(50) not null,
    isPrimary boolean default false,
    visitReportId integer not null,
    foreign key (visitReportId) references visitReport(id)
);

create table if not exists task(
    id integer auto_increment primary key,
    description varchar(300) not null,
    status varchar(25) not null,
    assignedTo integer not null,
    completeBy datetime not null,
    visitReportId integer not null,
    foreign key (assignedTo) references user(id),
    foreign key (visitReportId) references visitReport(id)
);
