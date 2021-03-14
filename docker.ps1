Set-Location $PSScriptRoot/manager/back
yarn docker

Set-Location $PSScriptRoot/agent-builder
yarn docker

Set-Location $PSScriptRoot/agent-prod
yarn docker
