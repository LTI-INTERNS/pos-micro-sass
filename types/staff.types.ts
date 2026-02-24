export interface Staff {
    id: string;
    name: string;
    staffNo: string;
    branch: string;
    position: string;
    email: string;
    phone: number;
    password?: string;
    pin?: string;
}

export type CreateStaffInput = Omit<Staff, 'id'>;
export type UpdateStaffInput = Partial<CreateStaffInput>;
