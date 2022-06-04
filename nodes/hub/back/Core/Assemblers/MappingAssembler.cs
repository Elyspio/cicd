using Cicd.Hub.Abstractions.Common.Assemblers;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Models;
using Cicd.Hub.Abstractions.Transports;

namespace Cicd.Hub.Core.Assemblers
{
	public class MappingAssembler : BaseAssembler<Mapping?, MappingEntity?>
	{
		public override MappingEntity? Convert(Mapping? obj)
		{
			if (obj == null) return null;

			return new MappingEntity
			{
				Id = obj.Id.AsObjectId(),
				Build = obj.Build,
				Deploy = obj.Deploy
			};
		}

		public override Mapping? Convert(MappingEntity? obj)
		{
			if (obj == null) return null;

			return new Mapping
			{
				Id = obj.Id.AsGuid(),
				Build = obj.Build,
				Deploy = obj.Deploy
			};
		}
	}
}