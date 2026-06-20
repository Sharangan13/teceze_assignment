export interface Employee {
  id: number;
  employee_no: string;
  employee_name: string;
  designation: string;
  salary: number;
  created_at?: string;
}

export type EmployeeFormData = Omit<Employee, "id" | "created_at">;
