group "default" {
	targets = [
		"agent-build", "agent-prod", "hub"
	]
}

target "hub" {
	context    = "../.."
	dockerfile = "./deploy/build/hub/hub.dockerfile"
	platforms  = [
		"linux/amd64", "linux/arm64", "linux/arm/v6", "linux/arm/v7"
	]
	tags       = [
		"elyspio/cicd:hub"
	]
}

target "agent-build" {
	context    = "../.."
	dockerfile = "./deploy/build/agent-build/agent-build.dockerfile"
	platforms  = [
		"linux/amd64",
	]
	tags       = [
		"elyspio/cicd:agent-build"
	]
}

target "agent-prod" {
	context    = "../.."
	dockerfile = "./deploy/build/agent-prod/agent-prod.dockerfile"
	platforms  = [
		"linux/amd64", "linux/arm64", "linux/arm/v6", "linux/arm/v7"
	]
	tags       = [
		"elyspio/cicd:agent-prod"
	]
}

