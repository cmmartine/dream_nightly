# First time set up

run `make build` and then `make up`. See Makefile for more commands

In console run `sudo chown -R $USER:$USER .` to have editing permissions for files generated in docker containers.

## Running tests

1. Run `make up`
2. Backend tests: `make rspec` or to run only one test `make one-rspec <path to spec>`
3. Frontend tests: `make jest` `make one-jest <path to spec>`

### To use Launchy in WSL for mailer follow the steps in this link:
https://github.com/copiousfreetime/launchy/issues/117#issuecomment-805730312