window.config = {
    endpoints: {
        core: {
            api: "http://localhost:4000",
            socket: {
                namespace: "/ws/front",
                hostname: "localhost:4000",
            }
        },
        authentication: {
            api: "http://localhost/authentication"
        }
    }
}
