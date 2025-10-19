# Dream Nightly

Dream Nightly is a journaling app for capturing dreams. Built with Rails and React.

## First-Time Setup

### Build & Boot the App
```bash
make build
make up
make rails
```

## Reseed the database on restart
`make db-reset` to seed the database with test users and dreams

## Test users:
Email: `testuser@test.com`, Password: `Testuser1!`
Email: `testuser2@test.com`, Password: `Testuser2!`

## Docker notes
To run Rails commands inside Docker with proper file permissions:
```bash
sudo chown -R $USER:$USER .
```

## Running tests

### Backend tests:
```bash
make rspec
make one-rspec <path/to/spec>
```
### Frontend tests:
```bash
make jest
make one-jest <path/to/spec>
```

### To use Launchy with WSL: Follow [this workaround](https://github.com/copiousfreetime/launchy/issues/117#issuecomment-805730312)

Then preview emails with:

```bash
wslopen tmp/letter_opener/path_to_file
```