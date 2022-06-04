﻿using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Transports
{
	public class Mapping: MappingRaw
	{
		[Required] public Guid Id { get; set; }
	}
}