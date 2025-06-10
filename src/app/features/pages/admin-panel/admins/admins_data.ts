import { City } from "../drivers/driver-full-details/driver_details";

export interface AdminsModel {
    id?:           number;
    first_name?:   string;
    last_name?:    string;
    email?:        string;
    phone_number?: string;
    image_url?:    string;
    role?:         string;
    city?:         City;
    created_at?:   Date;
    updated_at?:   Date;
}


