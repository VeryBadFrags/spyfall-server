FROM denoland/deno:2.0.2
WORKDIR /usr/src/app
COPY . ./
EXPOSE 8081
CMD ["deno", "task", "start"]
