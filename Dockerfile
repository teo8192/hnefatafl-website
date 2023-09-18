FROM rust:1.72

WORKDIR /usr/src/hnefatafl-website
COPY . .

COPY ./static /static

RUN cargo install --path .

CMD ["hnefatafl-website"]
