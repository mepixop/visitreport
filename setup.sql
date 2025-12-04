create database visitReport;

use visitReport;

create table if not exists user(
    id integer auto_increment primary key,
    username varchar(50) not null,
    password varchar(50) not null
);

create table if not exists visitReport(
    id integer auto_increment primary key,
    status enum("Open", "InProgress", "Closed") NOT NULL DEFAULT "Open",
    assignedTo integer not null,
    topic varchar(150) not null,
    type enum("VideoCall", "ExternalVisit", "InternalVisit", "Expo") NOT NULL,
    startTime datetime not null,
    endTime datetime not null,
    outcome enum("Normal", "Negative", "Positive", "VeryPositive") NOT NULL DEFAULT "Normal",
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
    status enum("Open", "InProgress", "Closed") NOT NULL DEFAULT "Open",
    assignedTo integer not null,
    completeBy datetime not null,
    visitReportId integer not null,
    foreign key (assignedTo) references user(id),
    foreign key (visitReportId) references visitReport(id)
);
--testdata
insert into user(username, password) values ("admin","password");

insert into visitReport
(status, assignedTo, topic, type, startTime, endTime, outcome, notes, followUp) 
values 
("Open", 1, "Visit Report 1", "VideoCall", "2025-12-02 09:00:00", "2025-12-02 09:30:00", "Positive", "They need an in person look", "Call Marie, Meeting with Mark"),
("Open", 1, "Visit Report 2", "ExternalVisit", "2025-12-03 09:00:00", "2025-12-02 09:30:00", "Normal", "Notes 2", "Talk to Ralph"),
("Open", 1, "Visit Report 3", "Expo", "2025-11-21 09:00:00", "2025-12-02 09:30:00", "Negative", "Notes 3", "Email Bob");

insert into contact
(name, isPrimary, visitReportId) values 
("Alice", true, 1),
("Roma", false, 1),
("Mark", false, 1),
("Bob", true, 2),
("Smitty", true, 3);

insert into task
(description, status, assignedTo, completeBy, visitReportId) 
values
("Task 1", "Open", 1, "2025-12-04 10:00:00", 1),
("Task 2", "Open", 1, "2025-12-04 12:00:00", 2),
("Task 3", "Open", 1, "2025-12-04 16:00:00", 3),
("Task 4", "Closed", 1, "2025-12-10 09:00:00", 3),
("Task 5", "Closed", 1, "2025-12-15 15:00:00", 2),
("Task 6", "InProgress", 1, "2025-11-20 14:00:00", 2);