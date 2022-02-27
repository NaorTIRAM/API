import { check } from 'express-validator'

export function checkAddress(arg_name){ 
    return [
    check(arg_name + '.city').notEmpty().isString(),
    check(arg_name + '.street').notEmpty().isString(),
    check(arg_name + '.houseNumber').notEmpty().isInt(),
    check(arg_name + '.apartmentNumber').notEmpty().isInt(),
    ];
}