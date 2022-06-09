import { createAsyncThunk } from "@reduxjs/toolkit";
import { AutomateService, JobId } from "../../../../core/services/cicd/automate.cicd.service";
import { toast } from "react-toastify";
import { ExtraArgument } from "../../index";


export const deleteJob = createAsyncThunk("automation/job/delete", async (id: JobId, { extra }) => {
	const { container } = extra as ExtraArgument;
	const automateService = container.get(AutomateService);
	await toast.promise(automateService.deleteJob(id), {
		success: `Job ${id} deleted successfully`,
		pending: `Deleting job ${id}`,
		error: `Failed to delete job ${id}`,
	});
});


export const getProductionApps = createAsyncThunk("automation/production/apps", async (_, { extra }) => {
	const { container } = extra as ExtraArgument;
	const automateService = container.get(AutomateService);
	return toast.promise(automateService.getProductionApps(), {
		success: "Production apps loaded successfully",
		pending: "Loading production apps",
		error: "Failed to load production apps",
	});
});