.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev     - Run in Dev mode"
	@echo "  make start   - Run in Prod mode"
	@echo "  make lint    - Lint the code"
	@echo "  make format  - Format the code"
	@echo "  make help    - Display this help message"

.PHONY: dev
dev:
	deno task dev

.PHONY: start
start:
	deno task start

.PHONY: lint
lint:
	deno lint

.PHONY: format
format:
	deno fmt
