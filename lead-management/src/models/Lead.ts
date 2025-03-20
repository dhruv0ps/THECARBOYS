export type Lead = {
    leadId: string;
    id?: string;
    status: string;
    month: string;
    manager: string;
    name: string;
    phoneNumber: string;
    leadSource: string;
    budget: number;
    paymentPlan: string;
    lastFollowUp: string;
    nextFollowUp: string;
    createdDate: string;
    updatedDate: string;
    priorityLevel: string;
    _id : string
    isActive? : boolean
    interestedModels: string[];
    createdBy?:User
  };
 export type User = {
    _id: number;
    username: string;
    role: string;
    email: string;
  };