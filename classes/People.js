import { Person } from "./Person.js";
import { Patient } from "./Patient.js";
import { PotentialPatient } from "./PotentialPatient.js";
import { getSingleByID } from "./functions.js";

export class People extends Array{
    constructor(){
        super(0);
        this.counterID = 0
    }

    getAllPatients(){
        let tmp =[]
        for(let i =0; i<this.length; i++){
            if(this[i].status == 'Patient')
                tmp.push(this[i].getPublic())
        }
        return tmp
    }

    getAllPotentialPatients(){
        let tmp =[]
        for(let i =0; i<this.length; i++){
            if(this[i].status == 'PotentialPatient')
                tmp.push(this[i].getPublic())
        }
        return tmp
    }

    getEncountersByPatient(patient){
        let potential_patients = getPotentialPatients()
        let arr =[patient]
        for(let i=0; i< potential_patients; i++){
            if(potential_patients[i].encounteredPatient == patient)
                arr.push(potential_patients[i].getPublic())
        }
        return arr;
    }

    getIsolated(){
        let tmp =[]
        for(let i =0; i<this.length; i++)
            if(this[i].isIsolated)
                tmp.push(this[i].getPublic())
        return tmp;
    }

    getPositiveSince(date){
        let tmp = []
        date = new Date(date)
        for (let i=0; i< this.length; i++)
            if(this[i].added_date  - date >= 0 && this[i].isCovidPositive )
                tmp.push(this[i].getPublic())
        return tmp
    }

    getByID(id){
        let tmp = getSingleByID(this, id, 'patientID');
        if(!tmp)
            return getSingleByID(this, id, 'potentialPatientID');
        return tmp;
    }

    addPatient(patient){
        patient.patientID =  this.counterID.toString();
        patient = new Patient(patient)
        this.push(patient)
        this.counterID++;
    }

    addPotentialPatient(potential_patient, encountered_patient_id){
        potential_patient.potentialPatientID = this.counterID.toString()
        potential_patient = new PotentialPatient(potential_patient)
        this.push(potential_patient)
        this.getByID(encountered_patient_id).encountered.push(potential_patient.getPublic())
        this.counterID++;
    }

    getAllEncounters(){
        let encounters =[]
        for(let i =0; i<this.length; i++){
            if(this[i].status == 'Patient')
                encounters.push(
                    {
                        potentialPatientDetails: this[i].encountered,
                        encounteredPatient: this[i].getPublic()
                    }
                )
        }
        return encounters;
    }

    movePotential(id,patient){
        let i = this.findIndex(x => x.potentialPatientID == id);
        this.splice(i, 1)
        this.addPatient(patient);
    }

    getByStatus(stat){
        let tmp = []
        for (let i=0; i< this.length; i++)
            if(this[i].status == stat )
                tmp.push(this[i])
        return tmp
    }

    getAllPositive(){
        let tmp = []
        for (let i=0; i< this.length; i++)
            if(this[i].isCovidPositive)
                tmp.push(this[i])
        return tmp
    }

    getCityStatistics(){
        let stats = [];
        for(let i =0 ;i<this.length;i++){
            let city_info = getSingleByID(stats, this[i].address.city, 'city')
            if(city_info){
                if(this[i].isCovidPositive)
                    city_info.infected++;
            }
            else
            {
                stats.push({city : this[i].address.city , infected:0})
                if(this[i].isCovidPositive)
                    stats[stats.length-1].infected++;
            }

        }
        return stats;
    }
}