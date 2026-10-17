.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev           - Run in Dev mode"
	@echo "  make start         - Run in Production mode"
	@echo "  make lint          - Lint the code"
	@echo "  make format        - Format the code"
	@echo "  make docker-build  - Build the Docker image"
	@echo "  make docker-dev    - Run in Dev mode with Docker"
	@echo "  make docker-clean  - Remove Docker containers"
	@echo "  make release VERSION=x.y.z - Tag and publish a release"
	@echo "  make help          - Display this help message"

.PHONY: dev
dev:
	pnpm run dev

.PHONY: start
start:
	pnpm start

.PHONY: lint
lint:
	pnpm run lint

.PHONY: format
format:
	pnpm run format

.PHONY: docker-build
docker-build:
	docker build -t spyfall-server .

.PHONY: docker-dev
docker-dev:
	docker compose -f compose.dev.yaml up -w

.PHONY: docker-clean
docker-clean:
	docker compose -f compose.dev.yaml down && docker compose down

.PHONY: release
release:
	@test -n "$(VERSION)" || (echo "Usage: make release VERSION=x.y.z" && exit 1)
	gh release create v$(VERSION) --generate-notes
