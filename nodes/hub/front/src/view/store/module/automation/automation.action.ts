import { createAsyncThunk } from "@reduxjs/toolkit";
import { container } from "../../../../core/di";
import { DiKeysService } from "../../../../core/di/di.keys.service";
import { AutomateService, JobId } from "../../../../core/services/cicd/automate.cicd.service";
import { toast } from "react-toastify";

const automateService = container.get<AutomateService>(DiKeysService.core.automate);


export const deleteJob = createAsyncThunk("automation/job/delete", async (id: JobId, thunkAPI) => {


	await toast.promise(automateService.deleteJob(id), {
		success: `Job ${id} deleted successfully`,
		pending: `Deleting job ${id}`,
		error: `Failed to delete job ${id}`,
	});
});
