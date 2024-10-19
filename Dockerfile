FROM denoland/deno:2.0.2
EXPOSE 8081
WORKDIR /app
USER deno

COPY deno.json deno.lock .
RUN deno install

COPY . .

CMD ["deno", "task", "start"]
