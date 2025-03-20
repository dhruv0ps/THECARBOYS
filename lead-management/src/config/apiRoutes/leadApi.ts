import { axiosRequest } from "../apiConfig/axiosRequest";
import { apiUrl } from "../apiConfig/apiUrl";

const addLead = async (body: any) => {
    return await axiosRequest.post<any>(apiUrl.addlead, body);
}

export const leadApi = {
    addLead
}