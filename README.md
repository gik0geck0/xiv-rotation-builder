# XIV Rotation Builder

LWR SPA to build up GCD rotations and analyze potencies

## Project Setup

The directory structure looks like this:

```fs
src/
  ├── assets/           // static assets
  │   └── recipes-logo.png
  |   └── favicon.ico
  └── modules/          // lwc modules
      └── example/
          └── app/
              ├── app.css
              ├── app.html
              └── app.js
lwr.config.json         // lwr configuration
package.json            // npm packaging configuration
```

## Configuration

The LWR server is configured in `lwr.config.json`, at the root of the project.

## Running the Project in dev Mode

```bash
yarn install
yarn dev # dev:compat for AMD format
```

test
Open the site at [http://localhost:3000](http://localhost:3000)