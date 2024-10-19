# Makefile for Node.js project

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev     - Run in Dev mode"
	@echo "  make build   - Build project"
	@echo "  make start   - Run in Prod mode"
	@echo "  make lint    - Lint the code"
	@echo "  make format  - Format the code"
	@echo "  make help    - Display this help message"

.PHONY: dev
dev:
	deno task dev

.PHONY: build
build: node_modules
	npm run build

.PHONY: start
start: node_modules dist/
	npm start

.PHONY: lint
lint:
	deno lint

.PHONY: format
format:
	deno fmt

dist/: src/
	make build

# Install dependencies if 'node_modules' is missing
node_modules: package-lock.json package.json
	npm install
	touch node_modules/
