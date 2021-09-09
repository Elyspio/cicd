window.config = {
    endpoints: {
        core: {
            api: "http://localhost:5000",
            socket: {
                namespace: "/ws/front",
                hostname: "localhost:5000",
            }
        }
    },
    authentication: {
        api: "https://elyspio.fr/authentication"
    }
}
