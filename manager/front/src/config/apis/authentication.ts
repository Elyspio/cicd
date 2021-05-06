export const getLoginPage = () => {
	const isDev = window.location.href.startsWith("http://localhost")

	return `${isDev ? "http://localhost:3001/" : "https://elyspio.fr/authentication/"}?target=${window.location.href}`
}
