// export interface FaqModel {
//     id?:         number;
//     question?: string;
//     answer?: string;
//     created_at?: Date;
//     updated_at?: Date;
// }

export interface FAQModel {
    success?:    boolean;
    message?:    string;
    data?:       FAQDatum[];
    pagination?: Pagination;
}

export interface FAQDatum {
    id?:         number;
    question?:   string;
    answer?:     string;
    admin?:      FAQAdmin;
    edited_by?:  null;
    is_active?:  boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface FAQAdmin {
    id?:           number;
    first_name?:   string;
    last_name?:    string;
    email?:        string;
    phone_number?: string;
    image_url?:    null;
    role?:         string;
}

export interface Pagination {
    page?:        number;
    page_size?:   number;
    total_items?: number;
    total_pages?: number;
}

export interface CreateFaqPayload {
    question: string;
    answer: string;
    is_active: boolean;
}
