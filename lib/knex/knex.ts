import knex from 'knex';

// Initialize Knex **without** a database connection
export const knexQuery = knex({ client: 'pg' });
