# Sprint Pulse

## Quick Start

Start the local Supabase environment with:

```bash
pnpm supabase:start
```

✏️ Save the "Perishable" Authentication Key from the terminal output.

After starting the local Supabase environment, add a test user via the Supabase
Studio (URL appears in the terminal output under "Development Tools").

✏️ Save the user's email and password.

With the user's email and password and the perishable authentication key, run
the following command and follow the prompts to get an authentication token:

```bash
pnpm get-token
```

✏️ Save the access token.

Once you have the access token, you can run the request tests in the `.http`
files in the `api` directory. (Make sure you have the "REST Client" extension
installed in VS Code from humao.)

## Deploying

Deploy both the API function and database migrations with:

```bash
pnpm run deploy
```

Deploy just the API function with:

```bash
pnpm deploy:api
```

Deploy just the database migrations with:

```bash
pnpm deploy:db
```

## Quality Assurance

### Linting

To run lint checks across the workspace:

```bash
pnpm lint
```

### Unit Tests

To run unit tests:

```bash
pnpm test
```

### Type Checking

To run type checks for the entire project:

```bash
pnpm type-check
```

You can also run them individually:

```bash
pnpm type-check:api
pnpm type-check:shared
```
