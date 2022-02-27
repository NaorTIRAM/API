import { Person } from "./Person.js"
import { check } from 'express-validator'

export class PotentialPatient extends Person{
    constructor(potential_patient)
    {
        super(potential_patient)
        this.potentialPatientID =  potential_patient.potentialPatientID;
        this.status =  'PotentialPatient';
    }

    getPublic(){
        //return object without these fields
        const { isIsolated,isPositive, lab_tests, negatives_in_a_row, isCovidPositive,added_date,status, ...publicObject } = this
        return publicObject;
    }  
}

export function checkPrimaryDetails(){ 
    return [
    check('firstName').notEmpty().isString(),
    check('lastName').notEmpty().isString(),
    check('phoneNumber').notEmpty().isString(),
    ];
}