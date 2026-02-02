import? '.local.just'
set allow-duplicate-recipes

PLAYWRIGHT := 'npx playwright'
PLAYWRIGHT_TEST := PLAYWRIGHT + ' test'

alias t := test
alias twe := test-web
alias tde := test-debug
alias the := test-headed
alias two := test-workers
alias tre := test-report
alias tci := test-ci
alias tcw := test-ci-web

[private]
default:
    @just --list

[private]
[arg("config", short="c", long="config")]
[arg("project", short="p", long="project")]
[arg("workers", short="w", long="workers")]
test-all config="" project="" workers="" *args="":
    {{PLAYWRIGHT_TEST}}\
        {{if config != "" { " --config " + config } else { "" }}}\
        {{if project != "" { " --project " + project } else { "" }}}\
        {{if workers != "" { " --workers " + workers } else { "" }}} \
        {{args}}

# [T]est : run all tests with local config
[group("playwright")]
test *args="": (test-all "" "" "" args)

# [T]est-[DE]bug : run all tests in debug mode with local config
[group("playwright")]
test-debug: (test-all "" "" "" "--debug")

# [T]est-[HE]aded : run tests in headed mode with local config
[group("playwright")]
test-headed: (test-all "" "" "" "--headed")

# [T]est-[WO]rkers : run tests with --workers "amount" with local config
[group("playwright")]
test-workers workers="1": (test-all "" "" workers)

# [T]est-[WE]b : run all tests from "web" project with local config
[group("playwright")]
test-web *args="": (test-all "" "web" "" args)

# [T]est-[CI] : run all tests tests with CI config
[group("playwright")]
test-ci *args="": (test-all "./environment/playwright-configs/base-ci.config.ts" "" "" args)

# [T]est-[WE]b : run all tests from "web" project with CI config
[group("playwright")]
test-ci-web *args="": (test-all "./environment/playwright-configs/base-ci.config.ts" "web" "" args)

# [T]est-[RE]port : show test report from --path "folder"
[group("playwright")]
[arg("path", short="p", long="path")]
test-report path="./playwright-report/html/local/":
  -{{PLAYWRIGHT}} show-report {{path}}

