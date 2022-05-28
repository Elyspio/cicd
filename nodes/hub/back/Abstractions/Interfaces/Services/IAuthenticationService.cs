namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IAuthenticationService
	{
		Task<bool> IsLogged(string token);
		Task<string> GetUsername(string token);

		Task<string> GetPermanentToken(string token);
	}
}