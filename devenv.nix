{ pkgs, lib, config, inputs, ... }:

{
  dotenv.enable = true;
  
  # https://devenv.sh/basics/
  env = {
    NODE_ENV="development";
    NEXTAUTH_URL="http://localhost:3000";
    NEXTAUTH_SECRET="cvk0SMhmSkJd4MJSuNBIeP/P9Iwr+Myi7T0bMhJ9Iv0=";
    POSTGRES_HOST="localhost";
    POSTGRES_PORT="5433";
    POSTGRES_USER="app";
    POSTGRES_PASSWORD="app";
    POSTGRES_DATABASE="app";

  };

  # https://devenv.sh/packages/
  packages = with pkgs; [
    git
    nodejs-18_x
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

  # # https://devenv.sh/scripts/
  # scripts.hello.exec = ''
  #   echo hello from $GREET
  # '';

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
