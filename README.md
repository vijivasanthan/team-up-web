# TeamUp Web
v1.20.2

## Prerequisits

1. Install Ruby for SASS, you can grab it here (http://rubyinstaller.org/downloads/). We need Ruby to fully use SASS functionality so let’s do it. Download it and install it.
2. To install SASS for Ruby just open the ruby console you’ve just installed and write/execute gem install sass –pre. If you face issues of permissions in the download of SASS due to SSL connections, you may execute this command first: gem source -a http://rubygems.org/ .
   This will install our friend SASS. You can see further details about SASS here (http://sass-lang.com/).
3. Install npm: https://nodejs.org/download/release/latest/
4. npm install -g grunt-cli
5. npm install -g bower

## Install
1. npm install
2. bower install
3. Remove the .example from app/scripts/localConfig.js
4. Remove the .example from test/spec/testConfig.js and ask a employee for the details of a test account

## Start dev
1. grunt serve

## Start testing
1. grunt test

## Create production build
1. grunt build

## Start production build
1. grunt dist

