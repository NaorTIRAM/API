import { Person } from "./Person.js";
import { Patient } from "./Patient.js";
import { PotentialPatient } from "./PotentialPatient.js";
import { getSingleByID } from "./functions.js";
import { People } from "./People.js";


export class dataBase{
    constructor(){
        this.people = new People();
        this.labtests =[]
    }
}