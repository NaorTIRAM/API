import { check } from 'express-validator'
import { checkDate } from './date-schema.js'
import { isUnique } from './functions.js'

export function checkLabTest(arr){ 
    return [
    check('labID').notEmpty().isString(),
    check('testID').notEmpty().isString().custom((value)=> {return  isUnique(arr,value,'testID')}),
    check('patientID').notEmpty().isString(),
    checkDate('testDate'),
    check('isCovidPositive').notEmpty().isBoolean()
    ];
}