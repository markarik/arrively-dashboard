export interface DriverFullDetailsModel {
    profile?: Profile;
    vehicle?: Vehicle;
}

export interface Profile {
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
    about_me?:        string;
    where_from?:      string;
    language?:        string[];
}

export interface City {
    id?:         number;
    name?:       string;
    created_at?: Date;
    updated_at?: Date;
    image_url?:  null;
}

export interface Vehicle {
    id?:                           number;
    vehicle_color?:                string;
    vehicle_style_id?:             number;
    vehicle_has_wheel_chair?:      boolean;
    vehicle_number_of_passengers?: number;
    vehicle_image?:                string;
    vehicle_plate_number?:         string;
    vehicle_make?:                 string;
    vehicle_model?:                string;
    vehicle_model_year?:           string;
    is_verified?:                  boolean;
    is_available_for_hire?:        boolean;
    hire_price_per_mile?:          number;
    vehicle_total_rides?:          number;
    style?:                        City;
    inspection?:                   AutoInsuarance;
    auto_insuarance?:              AutoInsuarance;
    vehicle_registration?:         AutoInsuarance;
    driver_license?:               AutoInsuarance;
    commercial_license?:           AutoInsuarance;
    created_at?:                   Date;
    updated_at?:                   Date;
}

export interface AutoInsuarance {
    id?:        number;
    document?:  string;
    is_active?: boolean;
}
