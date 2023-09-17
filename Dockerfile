FROM rust:1.72

WORKDIR /usr/src/hnefatafl-website
COPY . .

RUN cargo install wasm-pack
RUN rustup target add wasm32-unknown-unknown

RUN git clone https://github.com/teo8192/hnefatafl-webapp
RUN rm -r /usr/src/hnefatafl-website/webapp
RUN mv /usr/src/hnefatafl-website/hnefatafl-webapp /usr/src/hnefatafl-website/webapp
RUN cd /usr/src/hnefatafl-website/webapp && wasm-pack build --target web

RUN cd /usr/src/hnefatafl-website && cargo install --path .

RUN mkdir -p /webapp && cp -r /usr/src/hnefatafl-website/webapp/pkg /webapp/pkg
RUN cp -r /usr/src/hnefatafl-website/webapp/webpage /webapp/webpage

CMD ["hnefatafl-website"]
