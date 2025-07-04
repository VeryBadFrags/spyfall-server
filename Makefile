.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev           - Run in Dev mode"
	@echo "  make start         - Run in Production mode"
	@echo "  make lint          - Lint the code"
	@echo "  make format        - Format the code"
	@echo "  make docker-dev    - Run in Dev mode with Docker"
	@echo "  make docker-clean  - Remove Docker containers"
	@echo "  make help          - Display this help message"

.PHONY: dev
dev:
	pnpm run dev

.PHONY: start
start:
	pnpm run start

.PHONY: lint
lint:
	pnpm run lint

.PHONY: format
format:
	pnpm run format

.PHONY: docker-dev
docker-dev:
	docker compose -f compose-dev.yaml up -w

.PHONY: docker-clean
docker-clean:
	docker compose -f compose-dev.yaml down && docker compose down
