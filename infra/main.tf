variable "heroku_email" {
  description = "Email account used for provisioning against Heroku"
}

variable "heroku_api_key" {
  description = "API key for Heroku account associated with email"
}

variable "app_name" {
  description = "Name of the Heroku app to be provisioned"
}

provider "heroku" {
  version = "~> 2.0"
  email   = var.heroku_email
  api_key = var.heroku_api_key

}

resource "heroku_app" "app" {
  name   = "${var.app_name}"
  region = "us"
  organization {
    name = "noipm"
  }
}

resource "heroku_addon" "redis_addon" {
  app  = "${heroku_app.app.name}"
  plan = "rediscloud:30"
}

resource "heroku_addon" "postgres_addon" {
  app  = "${heroku_app.app.name}"
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_addon" "papertrail_addon" {
  app  = "${heroku_app.app.name}"
  plan = "papertrail:choklad"
}