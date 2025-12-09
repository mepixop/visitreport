# Visit Report Management System

## Description

This repository contains the source code for a Visit Report Management System, a web-based application designed to help employees create, track, and manage reports for customer visits. It was developed as a project for the IHK.

The system allows users to:
- Log in and view a personalized dashboard.
- See an overview of their assigned tasks, categorized by due date.
- Create new, detailed visit reports including information like attendees, topics, and outcomes.
- Automatically generate follow-up tasks from visit reports.
- Track the status of tasks and visit reports.

The application is built with [NestJS](https://nestjs.com/), a progressive Node.js framework, and uses Handlebars for server-side view rendering.

## Project Setup

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed. You can download them from [here](https://nodejs.org/).
- A running MySQL database instance.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/visit-report-project.git
   cd visit-report-project
   ```

2. **Install NPM packages:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - An empty database can be created by running the accompanying `setup.sql` file. This will create the necessary tables.
   - You can execute this file using a MySQL client of your choice, for example:
     ```bash
     mysql -u your_user -p your_database_name < setup.sql
     ```

4. **Configure environment variables:**
   - Create a `.env` file in the root directory of the project.
   - Add the following configuration details, replacing the placeholder values with your actual database credentials:
     ```
     DATABASE_USER=your_database_user
     DATABASE_PASSWORD=your_database_password
     DATABASE_NAME=your_database_name
     DATABASE_HOST=localhost
     ```

## Usage

Once the setup is complete, you can run the application in different modes.

### Development Mode

To run the application in a standard development mode:

```bash
# development
$ npm run start
```

### Watch Mode

To run the application in watch mode, which automatically restarts the server on file changes:

```bash
# watch mode
$ npm run start:dev
```

The application will be available at `http://localhost:3000`. By default, the root URL will redirect to the `/dashboard`.

## Running Tests

The project includes a suite of unit tests. To execute them, run the following command:

```bash
# unit tests
$ npm run test
```

This will run all test files and provide a summary of the results.
