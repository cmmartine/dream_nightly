# For Prod use only

FROM ruby:3.2.2

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev apt-utils curl git nodejs npm

WORKDIR /home
ENV NODE_VERSION=20.19.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION} && nvm alias default ${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

WORKDIR /app

COPY Gemfile Gemfile.lock ./
COPY package.json package-lock.json ./

RUN gem install bundler && bundle install --without development test
RUN npm install

COPY . .

RUN npm run build

RUN bundle exec rake assets:precompile

RUN rm -f tmp/pids/server.pid

EXPOSE 3000

ENTRYPOINT ["/app/bin/rails", "s", "-p", "3000", "-b", "0.0.0.0"]