import { City } from "./driver-full-details/driver_details";

export interface DriverAcountsModel {
    id?:              number;
    first_name?:      string;
    last_name?:       string;
    email?:           string;
    phone_number?:    string;
    image_url?:       string;
    created_at?:      Date;
    updated_at?:      Date;
    rate?:            number;
    number_of_rides?: number;
    city?:            City;
    about_me?:        null | string;
    where_from?:      null | string;
    language?:        string[] | null;
}

