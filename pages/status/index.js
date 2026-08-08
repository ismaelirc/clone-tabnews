import { up } from "infra/migrations/1766712347131_first-migration";
import useSWR from "swr";

async function fetchApi() {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DatabaseSatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("status", fetchApi, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleDateString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseSatus() {
  const { isLoading, data } = useSWR("status", fetchApi, {
    refreshInterval: 2000,
  });
  console.log(data);
  let dataBaseInfo = "Carregando...";

  if (!isLoading && dataBaseInfo) {
    dataBaseInfo = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.open_connections}
        </div>
        <div>
          Conexões máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Database</h1>
      {dataBaseInfo}
    </>
  );
}
