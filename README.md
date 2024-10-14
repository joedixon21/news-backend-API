# Northcoders News API

In order to connect to the two databases successfully, a developer must add in a connection.js file (which creates a connection to the server and sets PGDATABASE to either test or development depending on whether it is run within the Jest test suite or not).

For the test database, an app.test.js file is required where SuperTest is used to listen to the server when running the tests, and the database can be re-seeded between each test to ensure the tests are ran consistently and changes to the data aren't persistent (whilst the smaller database is also more manageable).

For the development database, a listen.js file is required to ensure that the server is listening when any requests are made to ensure it can send an appropriate response.

## Environment Variables set-up

For anyone who wishes to clone your project and run it locally, you must set up the environment variables as follows:

-   env.test file created with "PGDATABASE=nc_news_test"
-   env.development file created with "PGDATABASE=nc_news"

These files will be included in the .gitignore file meaning they will not be pushed to GitHub (important if the databses are sensitive and not to be shared publicly).

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
