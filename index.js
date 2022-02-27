import express from 'express';
const app = express();
const PORT = 3000; //listening on port 3000

app.use(express.json()) //using express to parse json requests
import { check, validationResult }  from 'express-validator';
import { checkPatient } from "./classes/Patient.js";
import { checkRoute } from "./classes/Route.js";
import { checkDate, validateDate } from './classes/date-schema.js'
import { checkLabTest } from './classes/LabTests.js';
import { checkPrimaryDetails } from './classes/PotentialPatient.js';
import { dataBase } from './classes/DataBase.js'
import { People } from './classes/People.js';

//initializing dataset.
let data_base = new dataBase();

// initializing the app
app.listen(
    PORT,
   () => {console.log(`listening on http://localhost:${PORT}`)}
)

//get patients request
app.get(`/patients`, (req, res) => {
    res.status(200).send(data_base.people.getAllPatients())
});

//add new patient request
app.put(`/patients`,
    checkPatient(data_base.people),
    (req,res)=>{
        //error handling
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).send(errors);

        //handling valid request
        data_base.people.addPatient(req.body);
        return res.status(200).send(data_base.people.getAllPatients());
});

//get full patient
app.get(`/patients/:id/full`,(req,res)=>{
    const {id} = req.params;

    let person = data_base.people.getByID(id)
    if(!person)   //incase patient doesn't exist 
        return res.status(400).send(`error person with ID = ${id} not found`)
    
    return res.status(200).send(person.getPublic(), person.isCovidPositive, person.labtests)
});

//add route request
app.put(`/patients/:id/route` ,   
checkRoute(),
(req,res)=>{
    //error handling
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).send(errors);

    const {id} = req.params;
    let person = data_base.people.getByID(id)
    if(!person || person.status != 'Patient')    //incase patient doesn't exist 
        return res.status(400).send(`error patient with ID = ${id} not found`)
    
    //adding route
    person.routes.push(req.body)
    return res.status(200).send(person.routes[person.routes.length-1]);
});

//get route by id
app.get(`/patients/:id/route`,(req,res)=>{

    const {id} = req.params;
    let person = data_base.people.getByID(id)
    if(!person || person.status != 'Patient')    //incase patient doesn't exist 
        return res.status(400).send(`error patient with ID = ${id} not found`)

    return res.status(200).send(person.routes);
})

//add encounters request
app.put(`/patients/:id/encounters` ,   
checkPrimaryDetails(),
(req,res)=>{
    //error handling
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).send(errors);

    const {id} = req.params;
    let person = data_base.people.getByID(id)
    if(!person || person.status != 'Patient')    //incase patient doesn't exist 
        return res.status(400).send(`error patient with ID = ${id} not found`)
    
    data_base.people.addPotentialPatient(req.body, id)
    return res.status(200).send(
        data_base.people[data_base.people.length -1].getPublic()
    );
});

//get encounters by id
app.get(`/patients/:id/encounters`,(req,res)=>{

     const {id} = req.params;
     let person = data_base.people.getByID(id)
     if(!person || person.status != 'Patient')    //incase patient doesn't exist 
         return res.status(400).send(`error patient with ID = ${id} not found`)

        
    return res.status(200).send(person.encounters);
})

//get patients since time
app.get(`/patients/new`,(req,res)=>{
    const value = req.query.since;

    //check date format
    if(!validateDate(value))
        return res.status(400).send(`invalid date ${value}`)

    //find patients after value and insert to tmp
    let arr = data_base.people.getPositiveSince(value)
    
    return res.status(200).send(arr)
});

//add labtest
app.post(`/labtests` ,
    checkLabTest(data_base.labtests),
    (req,res)=>{
        //error handling
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).send(errors);

        let person = data_base.people.getByID(req.body.patientID)
        if(!person)   //incase patient doesn't exist 
            return res.status(400).send(`error person with ID = ${req.body.patientID} not found`)

        data_base.labtests.push(req.body)
        person.addLabTest(req.body)
        return res.status(200).send(req.body.patientID);
    }
);

app.get('/patients/potential',
    (req,res)=>{
        return res.status(200).send(data_base.people.getAllEncounters())
    }
);

app.get('/patients/isolated',
    (req,res)=>{
        return res.status(200).send(data_base.people.getIsolated());
    }
);

app.post('/patients/potential/:potentialPatientId',
    checkPatient(data_base.people),
    (req,res)=>{
        //error handling
        const errors = validationResult(req);
        if(!errors.isEmpty())
            return res.status(400).send(errors);

        const {potentialPatientId} = req.params;
        let potential_patient = data_base.people.getByID(potentialPatientId)
        if(!potential_patient || potential_patient.status != 'PotentialPatient')
            return res.status(400).send(`error potential patient with ID = ${potentialPatientId} not found`)

        data_base.people.movePotential(potentialPatientId,req.body)
        return res.status(200).send({patientID: data_base.people[data_base.people.length-1].patientID});
    }
);


app.get('/statistics',
    (req,res)=>{
        let cityStatistics = data_base.people.getCityStatistics()
        return res.status(200).send({
            infected: data_base.people.getAllPositive().length,
            healed: data_base.people.getByStatus('Healed').length,
            isolated: data_base.people.getIsolated().length,
            cityStatistics: cityStatistics
        });
    }
);

//add labtests to id/full

//make regex not match globally