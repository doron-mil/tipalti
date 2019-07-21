import mockData from './tipalti-data';

class Person {
    fullName: Name;
    address: Address;

    computeIsDirectRelated = (aPerson: Person): boolean => {
        return (aPerson.fullName.isRelationEqual(this.fullName) || aPerson.address.isRelationEqual(this.address));
    };

    static outOfJson = (aJasonObject: any): Person => {
        const newPerson = new Person();
        newPerson.fullName = new Name(aJasonObject.firstName, aJasonObject.lastName);
        newPerson.address = new Address(aJasonObject.street, aJasonObject.city);
        return newPerson;
    };
}

class Name {
    firstName: string;
    lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    isRelationEqual = (aName: Name): boolean => {
        return (this.firstName === aName.firstName && this.lastName === aName.lastName);
    };
}

class Address {
    street: string;
    city: string;


    constructor(street: string, city: string) {
        this.street = street;
        this.city = city;
    }

    isRelationEqual = (aAddress: Address): boolean => {
        return (this.street === aAddress.street && this.city === aAddress.city);
    };

}

class RelatedPerson extends Person {
    directRelations: RelatedPerson[] = [];

    static createInstance(aPerson: Person, relatedPersonsArray: RelatedPerson[]) {
        const newRelatedPerson = new RelatedPerson();
        newRelatedPerson.fullName = aPerson.fullName;
        newRelatedPerson.address = aPerson.address;
        relatedPersonsArray.forEach(aRelatedPerson => {
            if (aRelatedPerson.computeIsDirectRelated(aPerson)) {
                aRelatedPerson.directRelations.push(newRelatedPerson);
                newRelatedPerson.directRelations.push(aRelatedPerson);
            }
        });
        return newRelatedPerson;
    }

    isDirectRelated = (aRelatedPerson: RelatedPerson): boolean => {
        return this.directRelations.findIndex(aRelated => aRelated === aRelatedPerson) >= 0;
    };
}

class Population {
    public relatedPersonsArray: RelatedPerson[] = [];

    init = (aStartingPopulation: Person []) => {
        aStartingPopulation.forEach(aPerson => {
            const newRelatedPerson = RelatedPerson.createInstance(aPerson, this.relatedPersonsArray);
            this.relatedPersonsArray.push(newRelatedPerson);
        });
    };

    FindMinRelationLevel = (aPersonA: RelatedPerson, aPersonB: RelatedPerson): number => {
        return aPersonA.isDirectRelated(aPersonB) ? 1 :
            this.findIndirectRelationLevel(aPersonA, aPersonB, new Array<RelatedPerson>(), 1);
    };

    findIndirectRelationLevel =
        (aPersonA: RelatedPerson, aPersonB: RelatedPerson,
         aCheckedRelatedPersonsArray: RelatedPerson[], aLevel: number): number => {

            const recursivePersonsArray: RelatedPerson[] = [];

            for (let aPersonARelated of aPersonA.directRelations) {
                if (aCheckedRelatedPersonsArray.find(aPersonRelated => aPersonARelated === aPersonRelated)) {
                    continue;
                } else if (aPersonARelated.isDirectRelated(aPersonB)) {
                    return aLevel + 1;
                } else {
                    recursivePersonsArray.push(aPersonARelated);
                }
            }
            const MIN_INT = 20000000;
            let minLevel = MIN_INT;
            recursivePersonsArray.forEach(aPersonARelated => {
                aCheckedRelatedPersonsArray.push(aPersonARelated);
                const level = this.findIndirectRelationLevel(
                    aPersonARelated, aPersonB, aCheckedRelatedPersonsArray, aLevel + 1);
                if (level < minLevel) {
                    minLevel = level;
                }

            });

            if (minLevel === MIN_INT) {
                minLevel = -1;
            }

            return minLevel;
        };
}

const personsArray = mockData.reduce((aPersonsArray: Array<Person>, aJsonData: any) => {
    aPersonsArray.push(Person.outOfJson(aJsonData));
    return aPersonsArray;
}, new Array<Person>());

const population = new Population();
population.init(personsArray);

console.log('check no. 1 : ',
    population.FindMinRelationLevel(population.relatedPersonsArray[0], population.relatedPersonsArray[1]));
console.log('check no. 2 : ',
    population.FindMinRelationLevel(population.relatedPersonsArray[0], population.relatedPersonsArray[2]));
console.log('check no. 3 : ',
    population.FindMinRelationLevel(population.relatedPersonsArray[0], population.relatedPersonsArray[3]));
console.log('check no. 4 : ',
    population.FindMinRelationLevel(population.relatedPersonsArray[1], population.relatedPersonsArray[2]));
console.log('check no. 5 : ',
    population.FindMinRelationLevel(population.relatedPersonsArray[1], population.relatedPersonsArray[3]));
console.log('check no. 6 : ',
    population.FindMinRelationLevel(population.relatedPersonsArray[2], population.relatedPersonsArray[3]));
