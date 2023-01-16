# Northcoders News Project
## Creating the environment variables to run this project locally

To run this project locally:

- Create a new .env file for the development data and for the test data:

```
touch .env.test
touch .env.development
```

- Within each file, set up the `PGDATABASE` so that it matches with its respective database as noted in the `setup.sql` file.

    So for example, `.env.test` will include:

```
PGDATABASE=nc_news_test
```

and `.env.development` will include:

```
PGDATABASE=nc_news
```
- Ensure that you install `dotenv` as a dependency. 






