import { AdminsModel } from "../admins/admins_data";

export interface AdminPaymentOptionsModel {
    id?:                  number;
    pay_method?:          string;
    admin?:               AdminsModel;
    is_active?:           boolean;
    icon_url?:            string;
    require_redirect?:    boolean;
    redirect_url?:        null | string;
    supported_platforms?: string[];
    created_at?:          Date;
    updated_at?:          Date;
}


export interface PlartfomsUsed {
    name: string,
    code: string
}


export interface UploadEvent {
    originalEvent: Event;
    files: File[];
}