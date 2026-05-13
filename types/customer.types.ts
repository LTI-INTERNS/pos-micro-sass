// ── Loyalty sub-record ────────────────────────────────────────────────────────

export interface CustomerLoyalty {
    customerLoyalId: string;
    totalPoints:     number;
    pointsRedeemed:  number;
    pointsBalance:   number;
}

// ── Phone sub-record ──────────────────────────────────────────────────────────

export interface CustomerPhone {
    id:     string;
    phone1: string;
    phone2: string | null;
}

// ── Branch sub-record (embedded in customer response) ────────────────────────

export interface CustomerBranch {
    branchId: string;
    name:     string;
}

// ── Core entity (mapped for frontend use) ────────────────────────────────────

export interface Customer {
    id:          string;
    name:        string;
    email:       string | null;
    promoCard:   string | null;
    activeState: boolean;
    createdAt:   string;
    updatedAt:   string;
    branch:      CustomerBranch;
    phones:      CustomerPhone[];
    loyalty:     CustomerLoyalty | null;
    phone:       string;
    points:      number;
}

// ── Backend raw response shape ────────────────────────────────────────────────

export interface BackendCustomer {
    customerId:  string;
    name:        string;
    email:       string | null;
    promocard:   string | null;
    activeState: boolean;
    createdAt:   string;
    updatedAt:   string;
    branch: {
        branchId: string;
        name:     string;
    };
    phones: {
        id:     string;
        phone1: string;
        phone2: string | null;
    }[];
    loyalty: {
        customerLoyalId: string;
        totalPoints:     number;
        pointsRedeemed:  number;
        pointsBalance:   number;
    } | null;
}

// ── API input types ───────────────────────────────────────────────────────────

export interface CreateCustomerInput {
    branchId:      string;
    name:          string;
    phoneNumber1:  string;
    phoneNumber2?: string;
    email?:        string;
    promocard?:    string;
}

export interface UpdateCustomerInput {
    name?:         string;
    email?:        string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    promocard?:    string;
    activeState?:  boolean;
}