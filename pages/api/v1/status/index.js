import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseName = process.env.POSTGRES_DB;
  const pgVersion = await database.query("Show server_version;");
  const databaseVersion = pgVersion.rows[0].server_version;
  const maxConnections = await database.query("Show max_connections;");
  const maxConnectionsResult = maxConnections.rows[0].max_connections;
  const databaOpenConnections = await database.query({
    text: "select count(*)::int from pg_stat_activity where datname = $1;",
    values: [databaseName],
  });

  const databaseOpenConnectionValue = databaOpenConnections.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(maxConnectionsResult),
        open_connections: databaseOpenConnectionValue,
      },
    },
  });
}

export default status;
