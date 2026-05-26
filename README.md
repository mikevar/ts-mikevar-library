# Mikevar TS Library

This is a monorepo for Mikevar's TypeScript backend libraries.
At first, this repo was intended to be a collection of TypeScript backend libraries, to make my life easier when building backend services.
The first pain point was the lack of a good data grid implementation for Drizzle ORM, so I created `@mikevar/drizzle-data-grid`.
After finishing early build of `@mikevar/drizzle-data-grid`, I began to build the `@mikevar/react-data-grid`, but then I realized some of the contracts are pretty much the same, so I extract the basic utilities, types, and whatnot to `@mikevar/data-grid`.

## Packages

- `@mikevar/data-grid` - Data grid abstraction
- `@mikevar/drizzle-data-grid` - Data grid implementation for Drizzle ORM
- `@mikevar/react-data-grid` - Data grid implementation for React
