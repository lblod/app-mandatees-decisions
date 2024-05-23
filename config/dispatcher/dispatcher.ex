defmodule Dispatcher do
  use Matcher

  define_accept_types(
    sparql: ["application/sparql-results+json"],
  )

  define_layers([:static, :sparql, :api_services, :frontend_fallback, :resources, :not_found])

  options "/*path", _ do
    conn
    |> Plug.Conn.put_resp_header("access-control-allow-headers", "content-type,accept")
    |> Plug.Conn.put_resp_header("access-control-allow-methods", "*")
    |> send_resp(200, "{ \"message\": \"ok\" }")
  end

  match "/sparql", %{ layer: :sparql, accept: %{ sparql: true } } do
    forward conn, [], "http://database:8890/sparql"
  end

  match "/*_path", %{layer: :not_found} do
    send_resp(conn, 404, "Route not found.  See config/dispatcher.ex")
  end
end
