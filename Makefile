# Makefile for Node.js project

# Define your default target (the one that runs when you just type "make" without arguments)
default: dev

# Targets and their respective commands
build: node_modules
	npm run build

dev: node_modules
	npm run dev

clean:
	npm run clean

help:
	@echo "Available targets:"
	@echo "  make build   - Run build"
	@echo "  make dev     - Run dev"
	@echo "  make clean   - Clean up project"
	@echo "  make help    - Display this help message"

# Ensure that 'make' knows these targets are not associated with files
.PHONY: build dev clean help

# Install dependencies if 'node_modules' is missing
node_modules: pnpm-lock.yaml
	npm install
