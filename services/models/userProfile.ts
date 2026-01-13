export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position?: string;
    locationId?: number,
    lineManager: string;
    locationName?: string,
    functionId?: number,
    functionName?: string,
    unit?: string,
    roles: any;
    profileImageUrl?: string;
    fullname?: string; // Added for ng-select display
    isActive?: boolean;
    isDeleted?: boolean;
    hobbies?: string;
    workMantra?: string;
    personalEmail?: string;
    phoneNumber?: string;
}
