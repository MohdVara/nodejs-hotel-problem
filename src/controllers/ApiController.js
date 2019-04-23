/**
 *  API Test EndPoint
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function checkLink(req,res,next) {
        res.json({
            message: "API Endpoint"
        });
}

/**
 *  Problem Statement API function
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function booking(req,res,next) {
    let resultBooking = {
        booking: {
            rooms: []
        }
    };

    let addRoom = (room) => {
        resultBooking.booking.rooms.push(room);
    };

    let addGuest = (guest, value) => {
        if(resultBooking.booking.rooms !== undefined){
            let currentRoom = resultBooking.booking.rooms[0];
            currentRoom[guest] = value;
        }
    };

    addRoom.bind(this);
    addGuest.bind(this);

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
                }else if(roomOccupants.includes(operation)){
                    let guestType = operation;
                    Object.keys(conditions[guestType]).map((parentOperation)=>{
                        if(OPERATION_DEF[0] == parentOperation){
                            setResult("minParentLimit",{ 
                                occupantType:  guestType,
                                value: conditions[operation][parentOperation]
                            });
                        }else if(OPERATION_DEF[1] == parentOperation){
                            setResult("maxParentLimit",{
                                occupantType:  guestType,
                                value: conditions[operation][parentOperation]
                            });
                        }else{

                        }
                    });
                }else{

                }
            });

            return result;
        };

        Object.keys(bookings).map((guest) => {
            let numOfBkRoom = 0;
            let {
                minLimit,
                maxLimit,
                minParentLimit,
                maxParentLimit
            } = initConstraint(guest,roomLimit2);
            let occupantNum = bookings[guest];

            let checkConstraintForMultipleRooms = (occupantNum) => {
                let needMultipleRooms = false;
                let checkParentConstraint = false;
                let tooMuch = false;
                let notEnough = false;
                let tooMuchParent = false;
                let notEnoughParent = false;
                let totalParent = 0;

                let addParent = (num) => {
                    totalParent += num;
                };
                addParent.bind(this);

                if(minLimit){
                    notEnough = occupantNum < minLimit;
                }

                if(maxLimit){
                    needMultipleRooms = needMultipleRooms || occupantNum >= maxLimit;
                }

                if(minParentLimit){
                    if(resultBooking.booking.rooms.length > 0){
                        totalParent = resultBooking.booking.rooms.reduce( (prev, room) => {
                            return prev + room[minParentLimit.occupantType];
                       },0);
                       addParent(totalParent);
                       
                    }
                    if(totalParent <= minParentLimit.value){
                        notEnoughParent = true;
                    }
                }

                if(maxParentLimit){ 
                    if(resultBooking.booking.rooms.length > 0){
                        totalParent = resultBooking.booking.rooms.reduce( (prev, room) => {
                            return prev + room[maxParentLimit.occupantType];
                       },0);
                       addParent(totalParent);
                       
                    }
                    if(totalParent >= maxParentLimit.value){
                        tooMuchParent = true;
                    }
                }



                return {
                    minLimit,
                    maxLimit,
                    minParentLimit,
                    maxParentLimit,
                    needMultipleRooms,
                    notEnough,
                    tooMuch,
                    notEnoughParent,
                    tooMuchParent,
                    roomsBooked,
                    totalParent
                };
            };

            let {
                needMultipleRooms,
                notEnough,
                tooMuch,
                notEnoughParent,
                tooMuchParent,
                roomsBooked,
                totalParent
            } = checkConstraintForMultipleRooms(occupantNum);


            switch(guest){
                case roomOccupants[0]:                    
                    if(needMultipleRooms && occupantNum <= bookLimit[guest]){
                        let remainGuestNum = occupantNum % maxLimit;
                        if(remainGuestNum != 0){
                            numOfBkRoom = occupantNum / maxLimit;
                            Array.from({ length: numOfBkRoom }).map(() => {
                                addRoom({[guest]: maxLimit});
                            });
                            addRoom({[guest]: remainGuestNum});
                        }else{
                            if(occupantNum > maxLimit){
                                numOfBkRoom = occupantNum / maxLimit;
                                Array.from({ length: numOfBkRoom }).map(() => {
                                    addRoom({[guest]: maxLimit});
                                });
                            }else{
                                addRoom({[guest]: occupantNum});
                            }
                            
                        }
                    }else if(notEnough){
                        addError(`Not enought ${guest} guest`);
                    }else if(tooMuch){
                        addError(`Too much ${guest}s guest`);
                    }else if(occupantNum > bookLimit[guest]){
                        addError(`Exceed limit of ${bookLimit[guest]} ${guest}s per booking`);
                    }else{
                        addRoom({[guest]: occupantNum });
                    } 
                break;

                case roomOccupants[1]:
                    if(needMultipleRooms){
                        let remainGuestNum = occupantNum % maxLimit;
                        if(remainGuestNum != 0){
                            numOfBkRoom = occupantNum / maxLimit;
                            Array.from({ length: numOfBkRoom }).map(() => {
                                addGuest(guest, maxLimit);
                            });
                            addGuest(guest, remainGuestNum);
                        }else{
                            addGuest(guest, occupantNum);
                        }
                    }else if(notEnoughParent){
                        addError("Minor must be accompanied by one adult");
                    }else if(tooMuchParent){
                        addError(`Too much ${minParentLimit.occupantType}s guest`);
                    }else{
                        addGuest(guest, occupantNum);
                    }         
                break;
                case roomOccupants[2]:
                    if(needMultipleRooms){
                        let remainGuestNum = occupantNum % maxLimit;
                        if(remainGuestNum != 0){
                            numOfBkRoom = occupantNum / maxLimit;
                            Array.from({ length: numOfBkRoom }).map(() => {
                                addGuest(guest, maxLimit);
                            });
                            addGuest(guest, remainGuestNum);
                        }else{
                            addGuest(guest, occupantNum);
                        }
                    }else if(notEnoughParent){
                        addError("Minor must be accompanied by one adult");
                    }else if(tooMuchParent){
                        addError(`Too much ${minParentLimit.occupantType}s guest`);
                    }else{
                        addGuest(guest, occupantNum);
                    } 
                    break;
                default:
                break;
            }
        });

        res.json(resultBooking);

}