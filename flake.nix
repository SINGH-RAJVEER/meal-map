{
  description = "Development environment for calorie-tracker";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # JavaScript runtime and package managers
            bun
            
            # Database
            postgresql_17
            
            # Development tools
            git
            
            # SSL certificates (needed for some npm packages)
            openssl
          ];

          shellHook = ''
            export PGDATA="''${PGDATA:-$PWD/.postgres}"
            export PGHOST="''${PGHOST:-localhost}"
            export PGPORT="''${PGPORT:-5432}"
          '';
        };
      }
    );
}
