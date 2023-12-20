# Makefile for Node.js project

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev     - Run in Dev mode"
	@echo "  make build   - Transpile to js into the dist/ folder"
	@echo "  make start   - Run in Prod mode"
	@echo "  make format  - Format code using Prettier"
	@echo "  make clean   - Remove the dist/ folder"
	@echo "  make help    - Display this help message"

# Targets and their respective commands
.PHONY: build
build: node_modules
	npm run build

.PHONY: dev
dev: node_modules
	npm run dev

.PHONY: start
start: node_modules
	npm start

.PHONY: lint
lint:
	npm run lint

.PHONY: format
format:
	npm run format

.PHONY: clean
clean:
	npm run clean

# Install dependencies if 'node_modules' is missing
node_modules: package-lock.json
	npm install
