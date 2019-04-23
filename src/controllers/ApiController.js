import debug from 'debug';
import { watch } from 'fs';
export function checkLink(req,res,next) {
        res.json({
            message: "API Endpoint"
        });
}

export function booking(req,res,next) {
    let resultBooking = {
        booking: {
            rooms: []
        }
    };

    let addRoom = (room) => {
        resultBooking.booking.rooms.push(room);
    };
    addRoom.bind(this);

    let initError = () => {
        resultBooking = {
            error: []
        };
    };
    

    let addError = (error) => {
        if(resultBooking.error == undefined){
            initError();
        }
        resultBooking.error.push(error);
    };
    addError.bind(this);

    let bookings = req.body.bookings;
        
        /* Intialize constraint data */
        const OPERATION_DEF = [ 
            "min", 
            "max"
        ];
        let roomOccupants = [
            "adult",
            "children",
            "infant"
        ];
        let roomLimit2 = 
            {
                adult: {
                    condition: {
                        max: 3
                    }
                },
                children: {
                    condition: {
                        adult: {
                            min: 1
                        }
                    }
                },
                infant: {
                    condition: {
                        adult: {
                            min: 1
                        }
                    }
                }
            };
        let bookLimit = {
            adult: 7
        };

        let roomNums = 3;
        /*========================*/
        
        let initConstraint = (guest,roomLimit) => {

            let result = { };
            let setResult = (property,value) => {
                result[property] = value;
            };

            setResult.bind(this);
            let conditions = roomLimit[guest].condition;
            Object.keys(conditions).map((operation) =>{
                if(OPERATION_DEF[0] == operation){
                    setResult("minLimit",conditions[operation]);
                }else if(OPERATION_DEF[1] == operation){
                    setResult("maxLimit",conditions[operation]);
                }else{
                    if(operation == "condition"){
                        parentConditions = operation;
                        Object.keys(parentConditions).map((operation) =>{
                            if(OPERATION_DEF[0] == operation){
                                setResult("minLimit",conditions[operation]);
                            }else if(OPERATION_DEF[1] == operation){
                                setResult("maxLimit",conditions[operation]);
                            }else{
                                setResult("error","Malformed constraint definition: " + operation);
                            }
                        });
                    }else{
                        setResult("error","Malformed constraint definition: " + operation);
                    }
                }
            });

            return result;
        };

        Object.keys(bookings).map((guest) => {
            let numOfBkRoom = 0;
            switch(guest){
                case roomOccupants[0]:

                    let {

                    } = initConstraint(guest,roomLimit2);
                    let occupantNum = bookings[guest];

                    addRoom();


                    /*
                    if(occupantNum > roomLimit[guest] && 
                       occupantNum <= bookLimit[guest]){

                        let remainGuestNum = occupantNum % limit;
                        if(remainGuestNum != 0){
                            numOfBkRoom = occupantNum / limit;
                            Array.from({ length: numOfBkRoom }).map(() => {
                                addRoom({[guest]: limit});
                            });
                            addRoom({[guest]: remainGuestNum});
                        }else{
                            
                        }

                    }else if(occupantNum > bookLimit[guest]){
                        addError("Exceed limit of 7 adults per booking");
                    }else{
                        addRoom({[guest]: occupantNum });
                    } 
                    */
                break;

                case roomOccupants[1]:
                    switch(true){
                        /* min */
                        case regexOpsDef[0].test(bookings[guest]):

                        break;

                        /* max */
                        case regexOpsDef[1].test(bookings[guest]):
                        break;

                        /* number */
                        case /^d/.test(booking[guest]):
                        break;
                    }
                break;
                case roomOccupants[2]:
                break;
                default:
                break;
            }
        });

        res.json(resultBooking);

}