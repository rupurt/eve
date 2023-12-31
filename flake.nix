{
  description = "Nix flake for Eve. Bottomless event streaming";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    bun-nix.url = "github:rupurt/bun-nix";
  };

  outputs = {
    flake-utils,
    nixpkgs,
    bun-nix,
    ...
  }: let
    systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    outputs = flake-utils.lib.eachSystem systems (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [
          bun-nix.overlay
        ];
      };
    in {
      # packages exported by the flake
      packages = {};

      # nix run
      apps = {};

      # nix fmt
      formatter = pkgs.alejandra;

      # nix develop -c $SHELL
      devShells.default = pkgs.mkShell {
        name = "default dev shell";
        packages = with pkgs; [
          bats
          bunpkgs.bun_1_0_14
          nodejs_21
          oha
        ];
      };
    });
  in
    outputs;
}
