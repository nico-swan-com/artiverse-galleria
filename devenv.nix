{ pkgs, lib, config, inputs, ... }:

{
  dotenv.enable = true;

  env = {
    NODE_ENV="local";
    SOPS_AGE_KEY_FILE="/home/nicoswan/.config/sops/age/keys.txt";
    NEXTAUTH_URL="http://localhost:3000";

    POSTGRES_HOST="localhost";
    POSTGRES_PORT="5433";
    POSTGRES_USER="app";
    POSTGRES_DATABASE="app";
    POSTGRES_SCHEMA="public";

    SMTP_SERVER_HOST="mail.cygnus-labs.com";
    SMTP_SERVER_PORT="465";
    SMTP_SERVER_SECURE="true";
    SITE_MAIL_RECEIVER="nico.swan@cygnus-labs.com";
    SMTP_SIMULATOR="true";
  };

  # https://devenv.sh/packages/
  packages = with pkgs; [
    git
    nodejs-18_x
    envsubst
  ];

  # https://devenv.sh/languages/
  languages.typescript.enable = true;

  # https://devenv.sh/processes/
  # processes = {
  #   "dev".exec = "npm run dev";
  # };

  # https://devenv.sh/services/
  services.postgres = {
    enable = true;
    createDatabase = true;
    initialDatabases = [
      {
        name = "app";
        user = "app";
        pass = "app";
      }
    ];
    listen_addresses = "*";
    port = 5433;
  };

  services.wiremock = {
    enable = true;
    port = 8080;
    mappings = [
      {
        request = {
          method = "GET";
          url = "/api/hello";
        };
        response = {
          status = 200;
          body = "Hello, world!";
        };
      }
    ];
  };

  # https://devenv.sh/scripts/
  scripts = {
    edit-secrets.exec = ''
      sops ./secrets.yaml
    '';
    generate-env.exec = ''
      sops --decrypt secrets.yaml |envsubst > .env
    '';
  };

  # enterShell = ''
  #   hello
  #   git --version
  # '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "build".exec = "npm run build";
  #   "format".exec = "npm run format";
  #   # "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  # enterTest = ''
  #   echo "Running tests"
  #   git --version | grep --color=auto "${pkgs.git.version}"
  # '';

  # https://devenv.sh/git-hooks/
  git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
