# Northcoders News API

## Summary of project:

This project is a RESTful API with the purpose of mimicking a real-world backend for a news platform (such as Reddit). It allows users to interact with the articles in a dynamic way. This information will be provided to the front end architecture in a follow-up project.

The database is PostgreSQL and is interacted with using node-postgres.

The hosted version is available [here](https://news-backend-api-r7r9.onrender.com).

## Set-up instructions

### Minimum versions required:

-   node.js v22.2.0
-   (PostgreSQL) 14.12 (Homebrew)

### Cloning the repo:

Run the following in the terminal:

```bash
git clone https://github.com/joedixon21/news-backend-API
cd nc-news-api # replace filename with where repo is saved locally
```

### Dependencies to install:

Dependencies to install for this project:

-   Jest
    -   Jest-sorted
-   PostgreSQL
    -   pg-format
-   Nodemon
-   Supertest
-   Dotenv
-   Express

```bash
npm install -D jest
npm install -D jest-sorted
npm install -D pg-format
npm install -D nodemon
npm install -D supertest
npm install pg
npm install dotenv
npm install express
```

### Seeding the data:

Navigate to the root of the project directory.

Run the following scripts in order to set up the database and seed the data:

```bash
npm run setup-dbs
npm run seed
```

### Running the tests:

Run the following using Jest in order to run the tests:

```bash
npm t app.test.js
```

### Environmental variables:

Run the following in the terminal:

```bash
echo "PGDATABASE=nc_news_test" > .env.test
echo "PGDATABASE=nc_news" > .env.development
```

Ensure that the .gitignore file contains the node_modules folder and .env file so that sensitive data is not later pushed to GitHub publicly:

```bash
echo -e "node_modules\n.env.\*" > .gitignore
```

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).
