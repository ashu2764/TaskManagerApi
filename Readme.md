## Postman Documentation
https://documenter.getpostman.com/view/28173427/2sA3s6GVdz

## docker 
docker pull ashu2764/task-manager-api

## Task Management API
# Overview
The Task Management API is a RESTful service designed for managing tasks within a project or workflow. Built using Node.js, Express, and Sequelize with PostgreSQL as the database, this API allows users to create, read, update, and delete tasks, offering robust data validation and secure authentication mechanisms.

# Features
Task Creation: Create tasks with attributes like title, description, status, priority, and due date.
Task Retrieval: Fetch all tasks or specific tasks by ID.
Task Updating: Update task details such as status, priority, or due date.
Task Deletion: Remove tasks by ID.
Data Validation: Ensures fields like status and priority conform to predefined values.
User Authentication: Securely manage user authentication with access and refresh tokens.


## Tech Stack
Backend: Node.js, Express
Database: PostgreSQL with Sequelize ORM
Authentication: JWT (JSON Web Tokens)
Security: HTTP-only cookies, bcrypt for password hashing


## Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v14 or higher)
PostgreSQL
npm

## Setup Instructions
1. Clone the Repository
git clone https://github.com/ashu2764/TaskManagerApi.git

cd task-management-api

2. Install Dependencies

npm install

3. Start The Project

npm run dev


//environment Variables required

export DB_HOST = localhost
export DB_PORT = 8000
export DB_USER = <userUsername>
export DB_PASS = <yourPassword>

export CORS_ORIGIN =*

export ACCESS_TOKEN_SECRET=hfiohwef98c80ru2q30727cfoijiooicimiwjoi90c392uf9
export ACCESS_TOKEN_EXPIRY = 1d

export  REFRESH_TOKEN_SECRET=jnoijuqhdquhuhui-d8q8878wwydtqgndubc-yekjbieyugh
export REFRESH_TOKEN_EXPIRY=10d
