# -*- encoding: utf-8 -*-
require File.expand_path('../rails/fabric/rails/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "fabric-rails"
  s.version     = Fabric::Rails::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["David Rice"]
  s.email       = ["me@davidjrice.co.uk"]
  s.homepage    = "http://rubygems.org/gems/fabric-rails"
  s.summary     = "Use fabric.js with Rails 3"
  s.description = "This gem provides fabric.js for your Rails 3 application."

  s.required_rubygems_version = ">= 1.3.6"
  s.rubyforge_project         = "fabric-rails"

  s.add_dependency "railties", ">= 3.2.0", "< 5.0"
  s.add_dependency "thor",     "~> 0.14"

  s.files        = `git ls-files rails vendor`.split("\n")+%w(fabric-rails.gemspec Gemfile, Gemfile.lock)
  s.executables  = []
  s.require_path = 'rails'
end
