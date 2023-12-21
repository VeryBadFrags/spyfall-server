# Makefile for Node.js project

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev     - Run in Dev mode"
	@echo "  make build   - Build project"
	@echo "  make start   - Run in Prod mode"
	@echo "  make lint    - Run eslint"
	@echo "  make format  - Format code using Prettier"
	@echo "  make clean   - Remove the dist/ folder"
	@echo "  make help    - Display this help message"

# Targets and their respective commands
.PHONY: build
build: node_modules
	pnpm run build

.PHONY: dev
dev: node_modules
	pnpm run dev

.PHONY: start
start: node_modules
	pnpm start

.PHONY: lint
lint:
	pnpm run lint

.PHONY: format
format:
	pnpm run format

.PHONY: clean
clean:
	pnpm run clean

# Install dependencies if 'node_modules' is missing
node_modules: package-lock.json
	pnpm install
