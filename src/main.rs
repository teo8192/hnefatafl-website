use axum::{
    body::StreamBody,
    extract::Path,
    http::{StatusCode, header::CONTENT_TYPE, HeaderMap},
    response::{Html, IntoResponse},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tokio::fs::File;
use tokio_util::io::ReaderStream;

#[tokio::main]
async fn main() {
    // initialize tracing
    tracing_subscriber::fmt::init();

    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(root))
        // `POST /users` goes to `create_user`
        .route("/users", post(create_user))
        .route("/webapp/*path", get(webapp_files))
        .route("/webpage/*path", get(webpage_files));

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn webapp_files(Path(path): Path<String>) -> impl IntoResponse {
    let file = format!("webapp/pkg/{}", path);
    tracing::debug!("path: {}", path);

    let file = match File::open(file).await {
        Ok(file) => file,
        Err(_) => {
            return Err(StatusCode::NOT_FOUND);
        }
    };

    let mut headers = HeaderMap::new();
    let contenttype = match path.split('.').last() {
        Some("js") => "application/javascript",
        Some("wasm") => "application/wasm",
        Some("html") => "text/html",
        Some("md") => "text/markdown",
        _ => "text/plain",
    };
    headers.insert(CONTENT_TYPE, contenttype.parse().unwrap());

    let stream = ReaderStream::new(file);

    let body = StreamBody::new(stream);

    Ok((headers, body))
}

async fn webpage_files(Path(path): Path<String>) -> impl IntoResponse {
    let file = format!("webapp/webpage/{}", path);
    tracing::debug!("path: {}", path);

    let file = match File::open(file).await {
        Ok(file) => file,
        Err(_) => {
            return Err(StatusCode::NOT_FOUND);
        }
    };

    let mut headers = HeaderMap::new();
    let contenttype = match path.split('.').last() {
        Some("js") => "application/javascript",
        Some("wasm") => "application/wasm",
        Some("html") => "text/html",
        Some("md") => "text/markdown",
        _ => "text/plain",
    };
    headers.insert(CONTENT_TYPE, contenttype.parse().unwrap());

    let stream = ReaderStream::new(file);

    let body = StreamBody::new(stream);

    Ok((headers, body))
}

// basic handler that responds with a static string
async fn root() -> Html<&'static str> {
    Html("<meta http-equiv=\"refresh\" content=\"0; url=webpage/index.html\">")
}

async fn create_user(
    // this argument tells axum to parse the request body
    // as JSON into a `CreateUser` type
    Json(payload): Json<CreateUser>,
) -> (StatusCode, Json<User>) {
    // insert your application logic here
    let user = User {
        id: 1337,
        username: payload.username,
    };

    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (StatusCode::CREATED, Json(user))
}

// the input to our `create_user` handler
#[derive(Deserialize)]
struct CreateUser {
    username: String,
}

// the output to our `create_user` handler
#[derive(Serialize)]
struct User {
    id: u64,
    username: String,
}
