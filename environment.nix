{
  "version": "0.0.22",
  "setup": {
    "pkgs": [
      {
        "name": "nodejs"
      },
      {
        "name": "yarn"
      }
    ],
  },
  "install": {
    "cmd": "yarn install --frozen-lockfile --production=false"
  },
  "build": {
    "cmd": "yarn build"
  },
  "start": {
    "cmd": "yarn start"
  },
  "variables": {
    "NPM_CONFIG_PRODUCTION": "false",
    "NODE_ENV": "production"
  },
  "static_assets": {}
}
