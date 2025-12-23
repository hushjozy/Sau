export interface IUser {
  firstName:           string;
  lastName:            string;
  fullname:            string;
  email:               string;
  position:            string;
  employeeId:          string;
  isSuperAdmin:        boolean;
  locationId:          number;
  locationName:        string;
  functionId:          number;
  functionName:        string;
  unitId:              number;
  unit:                string;
  lineManager:         string;
  lineManagerEmail:    string;
  headOfUnit:          string;
  headOfUnitEmail:     string;
  headOfFunction:      string;
  headOfFunctionEmail: string;
  hrbp:                string;
  hrbpEmail:           string;
  managerId:           string;
  lockoutCounter:      number;
  isLockedOut:         boolean;
  dateAccountLocked:   Date;
  mustChangePassword:  boolean;
  lastLogin:           Date;
  isAway:              boolean;
  delegationId:        number;
  pointsBalance:       number;
  id:                  string;
  isActive:            boolean;
  createdDate:         Date;
  createdBy:           string;
  modifiedDate:        Date;
  isDeleted:           boolean;
}


