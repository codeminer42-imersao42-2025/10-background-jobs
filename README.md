# node-task-manager

## Built with

- Node.js v24
- SQLite
- Knex

## Getting Started

1. Install the dependencies with

```
$ npm install
```

2. Create the env file with

```
$ cp .env.example .env
```

And populate the values accordingly.

3. Run the migrations with

```
$ npm run db:migrate
```

4. Start the server with

```
$ npm run start:dev
```

## Testing

Download [Bruno](https://www.usebruno.com/) and import the collection.

Log in to https://ethereal.email/ and use the `.env` credentials to check the mailbox.
