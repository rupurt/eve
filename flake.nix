{
  description = "Nix flake for Eve. Bottomless event streaming";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    bun.url = "github:rupurt/bun-nix";
  };

  outputs = {
    flake-utils,
    nixpkgs,
    bun,
    ...
  }: let
    systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    outputs = flake-utils.lib.eachSystem systems (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [
          bun.overlay
        ];
      };
    in rec {
      # packages exported by the flake
      packages = {
        bun = pkgs.bun {};
      };

      # nix run
      apps = {};

      # nix fmt
      formatter = pkgs.alejandra;

      # nix develop -c $SHELL
      devShells.default = pkgs.mkShell {
        name = "default dev shell";
        packages = with pkgs; [
          bats
          packages.bun
          nodejs_21
          oha
        ];
      };
    });
  in
    outputs;
}
