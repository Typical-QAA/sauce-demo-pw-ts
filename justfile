import? "~/repos/typical-qaa/typical.just"
set allow-duplicate-recipes

PLAYWRIGHT := 'npx playwright'
PLAYWRIGHT_TEST := PLAYWRIGHT + ' test'

alias t := test
alias td := test-debug
alias th := test-headed
alias tw := test-workers
alias tr := test-report

default:
    @just --list

[private]
[arg("config", short="c", long="config")]
[arg("project", short="p", long="project")]
[arg("workers", short="w", long="workers")]
test-all config="" project="" workers="" *args="":
    {{PLAYWRIGHT_TEST}} \
        {{if config != "" { "--config " + config } else { "" }}} \
        {{if project != "" { "--project " + project } else { "" }}} \
        {{if workers != "" { "--workers " + workers } else { "" }}} \
        {{args}}

test: test-all

test-debug: (test-all "" "" "" "--debug")

test-headed: (test-all "" "" "" "--headed")

test-workers workers="1": (test-all "" "" workers)

test-web: (test-all "" "web" "")

test-ci: (test-all "./environment/playwright-configs/base-ci.config.ts" "" "")

test-ci-web: (test-all "./environment/playwright-configs/base-ci.config.ts" "web" "")

[arg("path", short="p", long="path")]
test-report path="./playwright-report/html/local/":
  -{{PLAYWRIGHT}} show-report {{path}}

