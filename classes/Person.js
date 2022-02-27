export class Person extends Object{
    constructor(details)
    {
        super();
        this.firstName = details.firstName;
        this.lastName = details.lastName;
        this.phoneNumber = details.phoneNumber;

        
        //private fields
        this.status = 'Person'
        this.isIsolated=  true;
        this.isCovidPositive =  false;
        this.lab_tests = [];
        this.negatives_in_a_row =  0;
        this.added_date = (new Date());
    }

    addLabTest(lab_test)
    {
        this.lab_tests.push(lab_test)
        this.isCovidPositive = lab_test.isCovidPositive
        if(lab_test.isCovidPositive == false){
            this.negatives_in_a_row++
            this.isIsolated = this.negatives_in_a_row >=2? false:true;
            this.status = 'Healed'
        }
        else
        {
            negatives_in_a_row =0;
            this.status = 'Infected'
        }
    }
}
