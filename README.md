# First time set up

Run the following:
  1. `make build`
  2. `make up`
  3. `make rails`
  4. `make db-reset` to seed the database with test users and dreams

Test users:
  1. email: testuser@test.com, pw: Testuser1!
  2. email: testuser2@test.com, pw: Testuser2!

## Running certain rails commands in Docker:
In console run `sudo chown -R $USER:$USER .` to have editing permissions for files generated in docker containers.

## Running tests
1. Run `make up`
2. Backend tests: `make rspec` or to run only one test `make one-rspec <path to spec>`
3. Frontend tests: `make jest` `make one-jest <path to spec>`

### To use Launchy in WSL for mailer follow the steps in this link:
https://github.com/copiousfreetime/launchy/issues/117#issuecomment-805730312

Then you can use `wslopen tmp/letter_opener/path_to_file`