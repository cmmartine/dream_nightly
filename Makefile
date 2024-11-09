# https://stackoverflow.com/a/14061796/2237879
#
# Allows you to run make commands with any set of arguments
RUN_ARGS := $(wordlist 2, $(words $(MAKECMDGOALS)), $(MAKECMDGOALS))

up:
	docker compose up -d

down:
	docker compose down --remove-orphans

rspec: #run all rspec tests
	docker compose exec rails rspec

one-rspec: #run a single rspec
	docker compose exec rails rspec $(RUN_ARGS)

jest: #run all jest tests
	npm test

one-jest: #run a single jest test
	npm test $(RUN_ARGS)

rails-c: #launches containers rails console
	docker compose exec rails bin/rails c

build: #first time local dev setup
	docker compose build
	docker compose run --rm rails bin/rails db:create
	docker compose run --rm rails bin/rails db:migrate
	docker compose run --rm rails bin/rails db:seed

db-reset: #reset and reseed the database
	docker compose exec rails bin/rails db:reset

db-migrate: 
	docker compose exec rails bin/rails db:migrate

run-cmd: # example: make run-cmd rails g controller SomeController
	docker compose exec rails $(RUN_ARGS)

routes:
	docker compose exec rails rails routes