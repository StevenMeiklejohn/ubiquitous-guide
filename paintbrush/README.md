# Project paintbrush

TODO: Write a project description


## Installation

TODO: Describe the installation process

## Seeding

To seed the paintbrush database please use:

1. vagrant ssh
2. cd paintbrush/api
3. knex seed:run

## Usage

TODO: Write usage instructions

## Testing

Unit testing is via mocha. To run all tests:

1. vagrant ssh
2. cd paintbrush/api
3. mocha

OR for in-process (same as Codeship):

3. NODE_ENV=development node utils/testRunner.js

## Deploying - Staging
Deploy to staging with: ansible-playbook -vvvv -i provisioning/staging provisioning/site.yml

## Deploying - Production
Deploy to staging with: ansible-playbook -vvv -i provisioning/production provisioning/site.yml

### Production Database Access
To access the staging or production database do:

```bash
mysql --host=$MYSQL_HOST --user=$MYSQL_USER --password=$MYSQL_PASSWORD
```

Please note that this is a read/write user and you can destroy data doing this!

## Migrations
To create a new migration do:

knex migrate:make [simple-name-for-the-migration]

This creates a skeleton migration file in the migrations sub-directory. The skeleton is:

```javascript
exports.up = function(knex, Promise) {

};

exports.down = function(knex, Promise) {

};
```

Migrations are performed automatically via Ansible when ansible is used to deploy updates. However, on local machine
if you want to run the migration manually do:

```bash
knex migrate:latest
```

To rollback use:

```bash
knex migrate:rollback
```

## Logging
Logging data is currently stored on local machine using pm2. To view console logs, first ssh to server as 'arn' and do:

```bash
pm2 logs all
```

## Contributing

1. Create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am 'Add some feature'`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request :D

## Build Status
[ ![Codeship Status for artretailnetwork/paintbrush](https://codeship.com/projects/ae36ae50-fd3d-0132-54ed-46b29513b11c/status?branch=master)]
(https://codeship.com/projects/87711)

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license

