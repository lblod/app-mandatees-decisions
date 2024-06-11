defmodule Dispatcher do
  use Matcher

  define_accept_types(
    sparql: ["application/sparql-results+json"],
    json: [ "application/json", "application/vnd.api+json" ],
    html: [ "text/html", "application/xhtml+html" ]
  )

  define_layers([:static, :sparql, :api_services, :frontend_fallback, :resources, :not_found])

  options "/*_path", _ do
    conn
    |> Plug.Conn.put_resp_header("access-control-allow-headers", "content-type,accept")
    |> Plug.Conn.put_resp_header("access-control-allow-methods", "*")
    |> send_resp(200, "{ \"message\": \"ok\" }")
  end


  #################################################################
  # Jobs-Dashboard: API
  #
  # Note: some endpoints will not be used in the application
  #  but are added here; to make the frontend-dashboard
  #  work correctly.
  #################################################################
  match "/remote-data-objects/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/remote-data-objects/"
  end

  match "/harvesting-collections/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/harvesting-collections/"
  end

  match "/jobs/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/jobs/"
  end

  match "/tasks/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/tasks/"
  end

  match "/scheduled-jobs/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/scheduled-jobs/"
  end

  match "/scheduled-tasks/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/scheduled-tasks/"
  end

  match "/cron-schedules/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/cron-schedules/"
  end

  match "/data-containers/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/data-containers/"
  end

  match "/job-errors/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/job-errors/"
  end

  ###########################
  # Jobs-Dashboard: frontend
  ###########################

  match "/index.html", %{ layer: :static } do
    forward conn, [], "http://jobs-dashboard/index.html"
  end

  get "/assets/*path",  %{ layer: :static } do
    forward conn, path, "http://jobs-dashboard/assets/"
  end

  get "/@appuniversum/*path", %{ layer: :static } do
    forward conn, path, "http://jobs-dashboard/@appuniversum/"
  end

  match "/*path", %{ layer: :frontend_fallback, accept: %{ html: true } } do
    # we don't forward the path, because the app should take care of this in the browser.
    forward conn, [], "http://jobs-dashboard/index.html"
  end

  #################################################################
  # Deltas: mandatees-decisions
  #################################################################

  get "/sync/mandatees-decisions/files/*path", %{ layer: :api_services } do
    forward conn, path, "http://delta-producer-publication-graph-maintainer/mandatees-decisions/files/"
  end

  #################################################################
  # DCAT
  #################################################################
  match "/datasets/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/datasets/"
  end

  match "/distributions/*path", %{ layer: :resources, accept: %{ json: true } } do
    Proxy.forward conn, path, "http://resource/distributions/"
  end

  #################################################################
  # Files
  #################################################################

  match "/files/*path", %{ layer: :resources, accept: %{ json: true } } do
    forward conn, path, "http://resource/files/"
  end

  get "/files/:id/download", %{ layer: :api_services } do
    forward conn, [], "http://file/files/" <> id <> "/download"
  end

  post "/files/*path", %{ layer: :api_services } do
    forward conn, path, "http://file/files/"
  end

  delete "/files/*path", %{ accept: [ :json ], layer: :api_services } do
    forward conn, path, "http://file/files/"
  end

  #################################################################
  # SPARQL endpoint
  #################################################################

  match "/sparql", %{ layer: :sparql, accept: %{ sparql: true } } do
    forward conn, [], "http://database:8890/sparql"
  end

  match "/*_path", %{layer: :not_found} do
    send_resp(conn, 404, "Route not found.  See config/dispatcher.ex")
  end
end
