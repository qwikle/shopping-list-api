

# Requirements

This project need: 

1. Redis
2. Postgrsql
3. nodeJs >= v 16.15


# Installation

inside the project run

```
npm install
```

then after all packages are installed, configure the .env file or create it based on the .env.example

after that run migration

```
node ace migration:run
```

and finally

```
npm run dev
```

## Email

to receive the email during dev use mailtrap or other service.

### Important

This project is working with the shopping list flutter app.
currently only the authentifation services works.

- Create account
- sign in
- sign out
- forgot password
- reset password