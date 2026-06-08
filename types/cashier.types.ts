// ── Core entity ───────────────────────────────────────────────────────────────

export interface Cashier {
    id:           string;   // cashierId
    cashierNo:    string;
    name:         string;
    email:        string;
    phone:        string;
    branchId:     string;
    branchName?:  string;
    imgUrl:       string | null;
    activeStatus: boolean;
    totalRevenue?: number;  // aggregated field for management table
}

// ── API input types ───────────────────────────────────────────────────────────

export interface CreateCashierInput {
    branchId:   string;
    cashierNo:  string;
    name:       string;
    email:      string;
    phone:      string;
    pin:        string;
    imgUrl?:    string;
}

export interface UpdateCashierInput {
    branchId?:  string;
    cashierNo?: string;
    name?:      string;
    email?:     string;
    phone?:     string;
    imgUrl?:    string;
}

// ── API response types ────────────────────────────────────────────────────────

export interface CashierResponse {
    cashierId:    string;
    cashierNo:    string;
    name:         string;
    email:        string;
    activeStatus: boolean;
    imgUrl:       string | null;
}
