import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('refresh_tokens', table => {
        table.increments('id').primary();
        table.integer('user_id').notNullable().unsigned();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.text('token').notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('refresh_tokens')
}

