# For Prod use only

FROM ruby:3.2.2

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev curl git nodejs npm postgresql-15 supervisor=4.2.4-1

WORKDIR /app

ENV NODE_VERSION=20.4.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION} && nvm alias default ${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

COPY Gemfile Gemfile.lock ./
COPY package.json package-lock.json ./

RUN gem install bundler && bundle install --without development test
RUN npm install && npm run build

COPY . .

RUN bundle exec rake assets:precompile

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /var/lib/postgresql/data && chown -R postgres:postgres /var/lib/postgresql

EXPOSE 3000

CMD ["/usr/bin/supervisord"]