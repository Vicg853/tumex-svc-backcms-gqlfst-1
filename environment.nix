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
    "baseImage": "ghcr.io/railwayapp/nixpacks:debian-1654798583"
  },
  "install": {
    "cmd": "yarn install --frozen-lockfile --production=false"
  },
  "build": {
    "cmd": "yarn build:all"
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
