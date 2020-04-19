# Headstorm React UI

HS-UI is lovingly developed by Headstorm's Open Source group. Please reach out to us at: opensource@headstorm.com

## Contributing

Pick a ticket from the `Priority to do` swim-lane of the [project board](https://github.com/Headstorm/hs-angular-ui/projects/1). Fork and clone the repository and create a branch for your ticket, with the ticket number prefixing the name of the ticket (i.e. `4-publish-package-to-npm`). When making commits, be sure to prefix your commit messages with the ticket number, like so: `#4 Updating package.json to make the package public`. Once you've made a commit it should automatically be moved to the `In progress` swim-lane, and then moved to `Needs review` once a PR is made.

## Running the development server locally
Run `yarn install` to install the dependencies, then you can run `yarn start` to start the storybook server.
The app will automatically reload if you change any of the source files.

## Creating new components

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Building the package for publishing

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
