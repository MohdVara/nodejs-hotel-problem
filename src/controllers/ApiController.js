const OPERATION_DEF = [
    "min",
    "max"
];
const ROOM_OCCUPANTS = [
    "adult",
    "children",
    "infant"
];

const ROOM_LIMIT = {
    adult: {
        condition: {
            max: 3
        }
    },
    children: {
        condition: {
            max: 3,
            adult: {
                min: 1
            }
        }
    },
    infant: {
        condition: {
            max: 3,
            adult: {
                min: 1
            }
        }
    }
};

/* ----- */

const BOOK_LIMIT = {
    adult: 7
};

const BOOK_LIMIT2 = 7;

/**
 * Simple Constraint Parser Engine
 * This function intialize the required constraint into the function from a object rule set.
 * Only support of up to one level parent guest type but could be set for multiple parent guest type.
 * Could be used for rule parsing for other application.
 * @param {String} entity - type of entity.
 * @param {Object} ruleset - Rules definition
 * Example of rule definition:
 * ROOM_LIMIT = {
 *  adult: {
 *       condition: {
 *           max: 3
 *       }
 *   },
 *   children: {
 *       condition: {
 *           adult: {
 *               min: 1
 *           }
 *       }
 *   },
 *   infant: {
 *       condition: {
 *           adult: {
 *               min: 1
 *           }
 *       }
 *   }
 *  };
 *  @returns If no errors found bookingConstraint/resultConstrantis return else error
 *  will be given 
 */
let initConstraint = (entity, operationDef, entityDefinition, ruleset) => {

    const OPERATION_DEF = operationDef;
    const ENTITY_DEF = entityDefinition;

    let result = {};

    /** Set result in this scope for returning result */
    let setResult = (property, value) => {
        result[property] = value;
    };
    setResult.bind(this);

    if (ruleset[entity] == undefined) {
        setResult("error", {
            message: "Ruleset defective"
        });
        return result;
    }

    let conditions = ruleset[entity].condition;

    /** Loop to read rule set objecet and set it to the variable limits */
    for (let operation in conditions) {

        /** if operation == "min" */
        if (OPERATION_DEF[0] == operation) {

            setResult("minLimit", parseInt(conditions[operation]));

            /** if operation == "max" */
        } else if (OPERATION_DEF[1] == operation) {

            setResult("maxLimit", parseInt(conditions[operation]));

            /** if operation is equal to another guest type [Nested rule] */
        } else if (ENTITY_DEF.includes(operation)) {

            let entityType = operation;
            for (let parentOperation in conditions[entityType]) {
                if (OPERATION_DEF[0] == parentOperation) {
                    setResult("minParentLimit", {
                        entityType: entityType,
                        value: parseInt(conditions[operation][parentOperation])
                    });
                } else if (OPERATION_DEF[1] == parentOperation) {
                    setResult("maxParentLimit", {
                        entityType: entityType,
                        value: parseInt(conditions[operation][parentOperation])
                    });
                } else {
                    //Ruleset defective
                    setResult("error", {
                        message: "Ruleset defective"
                    });
                }
            }
        } else {
            //Ruleset defective
            setResult("error", {
                message: "Ruleset defective"
            });
        }
    }

    return result;
};


/**
 * Implementation Booking Qualification Engine based on Simple Constraint Parser  
 * Function that checks for multiple booking conditions based on bookingConstraint
 *  1. Minimun amount of guest
 *  2. Maximum amount of guest
 *  3. Minimum amount of parent guest in booking
 *  4. Maximum amount of parent guest in booking 
 * @param {Number} occupantNum 
 * 
 * @param {Object} bookingConstraint - contains room occupancy limits as defined.
 * @param {Number} [bookingConstraint.minLimit] - Minimum amount of guest to book a room
 * @param {Number} [bookingConstraint.maxLimit] - Maximum amount of guest to book a room.
 * 
 * @param {Object} [bookingConstraint.minParentLimit] - Object that describe the parent for this type of guest and minimum requirement value.
 * @param {String} [bookingConstraint.minParentLimit.occupantType] - Type of guest. 
 * @param {String} [bookingConstraint.minParentLimit.value] - Number of this type of guest required.
 * 
 * @param {Object} [bookingConstraint.maxParentLimit] - Object that describe the parent for this type of guest and maximum requirement value.
 * @param {String} [bookingConstraint.maxParentLimit.occupantType] - Type of guest.
 * @param {String} [bookingConstraint.maxParentLimit.value] - Number of this type of guest required. 
 * 
 * @param {Object} resultBooking contains results to be sent to the API consumer.
 *  Example :
 *  If sucessful:  
 *      resultBooking {
 *          booking: {
 *              rooms: [
 *                 { adult: 3},
 *                 { adult: 3}
 *              ]
 *          } 
 *      }
 * If error:
 *     resultBooking {
 *          error: [
 *             "This is an example error message"
 *          ]
 *      }
 *  
 * 
 * @returns {Oject} checkConditionsResult 
 * @property {Boolean} checkConditionsResult.needMultipleRooms - true if booking requires multiple rooms
 * @property {Boolean} checkConditionsResult.notEnough - true if booking doesn't meet minimun guest requirement per room.
 * @property {Boolean} checkConditionsResult.tooMuch -  true if booking doesn't meet maximum guest requirement per room.
 * @property {Boolean} checkConditionsResult.notEnoughParent - true if booking doesn't meet minimum parent guest requirement in booking.,
 * @property {Boolean} checkConditionsResult.tooMuchParent - true if booking doesn't meet parent maximum guest requirement in booking., 
 *  
 */
let checkConstraintForMultipleRooms = (occupantNum, {
    minLimit,
    maxLimit,
    minParentLimit,
    maxParentLimit,
    resultBooking
}) => {
    let needMultipleRooms = false;
    let tooMuch = false;
    let notEnough = false;
    let tooMuchParent = false;
    let notEnoughParent = false;
    let totalParent = 0;

    if (minLimit) {
        notEnough = occupantNum < minLimit;
    }

    if (maxLimit) {
        needMultipleRooms = needMultipleRooms || occupantNum >= maxLimit;
    }

    if (minParentLimit) {
        if (resultBooking.booking !== undefined) {
            if (resultBooking.booking.rooms.length > 0) {
                totalParent = resultBooking.booking.rooms.reduce((prev, room) => {
                    return prev + parseInt(room[minParentLimit.entityType]);
                }, 0);
            }
        }
        if (totalParent <= minParentLimit.value) {
            notEnoughParent = true;
        }
    }

    if (maxParentLimit) {
        if (resultBooking.booking.rooms !== undefined && resultBooking.booking.rooms.length > 0) {
            totalParent = resultBooking.booking.rooms.reduce((prev, room) => {
                return prev + parseInt(room[maxParentLimit.entityType]);
            }, 0);

        }
        if (totalParent >= maxParentLimit.value) {
            tooMuchParent = true;
        }
    }



    return {
        needMultipleRooms,
        notEnough,
        tooMuch,
        notEnoughParent,
        tooMuchParent,
        totalParent
    };
};

/**
 *  API Test EndPoint
 *  Express route function
 */
export function checkLink(req, res, next) {
    res.json({
        message: "API Endpoint"
    });
}

/**
 *  Problem Statement API function
 *  Express route function
 */
export function booking(req, res, next) {

    let resultBooking = {};
    let totalGuest= 0;
    /** Function to intialize response to return rooms map */
    let initRoom = () => {
        resultBooking = {
            booking: {
                rooms: []
            }
        };
    };

    let addTotalGuest = (num) => {
        totalGuest += num;
    }

    let resetRoom = () => {
        resultBooking = {};
    };

    /** Function to intialize response to return errors */
    let initError = () => {
        resultBooking = {
            error: []
        };
    };

    let checkGuestFirstRoom = (guest) => {
        let firstRoomParentAmout = resultBooking.booking.rooms[0][guest];
        return firstRoomParentAmout;
    }

    /** Function to intialize response to add room to room map */
    let addRoom = (room) => {
        if (resultBooking.booking == undefined) {
            initRoom();
        }
        resultBooking.booking.rooms.push(room);
    };

    /** COMMENT: This is due that all children and infant will be placed as in the 
     * first room since it was not in the problem statement to limit children. 
     * The rule engine could support this kind of rule when needed */

    /** Function to intialize response to add guest to the first room */
    let addGuest = (guest, value, index) => {
        if (resultBooking.booking.rooms !== undefined && value != 0) {
            let currentRoom = resultBooking.booking.rooms[index];
            currentRoom[guest] = value;
        }
    };

    /** Function that appends error to result and remove incomplete result */
    let addError = (error) => {
        if (resultBooking.error == undefined) {
            initError();
        }
        resultBooking.error.push(error);
    };

    /** Bind to current scope */
    addTotalGuest.bind(this);
    addRoom.bind(this);
    addGuest.bind(this);
    addError.bind(this);

    /** Bookings from API consumer request*/
    let bookings = req.body.bookings;

    /** Check if bookings where defined in the request*/
    if (bookings == undefined) {
        addError("Missing data from client");
    } else {

        /** Check if bookings object was not empty*/
        if (Object.keys(bookings).length == 0) {
            addError("Missing data from client");
            return res.json(resultBooking);
        }

        /** Count the number of guest excluding babies */
        for (var guest in bookings){
            if (bookings.hasOwnProperty(guest) && guest != "infant") {
                addTotalGuest(parseInt(bookings[guest]));
            }
        }

        if(totalGuest > BOOK_LIMIT2){
            addError("Too many guests");
            return res.json(resultBooking);
        }

        for (let guest in bookings) {
            let numOfBkRoom = 0;

            let checkError = initConstraint(guest, OPERATION_DEF, ROOM_OCCUPANTS, ROOM_LIMIT);
            if (checkError.error !== undefined) {
                addError(checkError.error.message);
                break;
            }

            let {
                minLimit,
                maxLimit,
                minParentLimit,
                maxParentLimit
            } = initConstraint(guest, OPERATION_DEF, ROOM_OCCUPANTS, ROOM_LIMIT);
            let occupantNum = parseInt(bookings[guest]);

            let {
                needMultipleRooms,
                notEnough,
                tooMuch,
                notEnoughParent,
                tooMuchParent,
                totalParent
            } = checkConstraintForMultipleRooms(occupantNum, {
                minLimit,
                maxLimit,
                minParentLimit,
                maxParentLimit,
                resultBooking
            });

            /** COMMENT: BOOK_LIMIT should be in the Booking Qualification Engine but is
             *  currently placed in with a dedicated ruleset outside the constraint engine 
             *  for constraint simplification purposes.
             */

            /**
             * COMMENT: The checks have some important duplicate code from the adult check code
             * due to the fact after the adult have booked room/rooms. Children and infant will 
             * be all placed in the first room. Due to simplification purposes.
             */

            /** Check for every guest type based on consumer API request */
            switch (guest) {
                /** Check for adults */
                case ROOM_OCCUPANTS[0]:
                    /** COMMENT: BOOK_LIMIT should be in the Booking Qualification Engine but is
                     *  currently placed in with a dedicated ruleset outside the constraint engine 
                     *  for constraint simplification purposes.
                     */
                    numOfBkRoom = Math.ceil(occupantNum / maxLimit);
                    /** If adults more than 3 and less than 7 */
                    if (needMultipleRooms && occupantNum > 0) {
                        /** Check if occupant could be evenly distributed based on the maxLimit*/
                        let remainGuestNum = occupantNum % maxLimit;

                        /** Guests couldn't be evenly distributed and full rooms will be counted
                         * and return remaining to the last room.
                         */
                        if (remainGuestNum != 0) {
                            
                            var i = 1;
                            var excludeLastRoom = numOfBkRoom - 1;
                            do {
                                addRoom({
                                    [guest]: maxLimit
                                });
                                i++;
                            } while (i <= excludeLastRoom);
                            addRoom({
                                [guest]: remainGuestNum
                            });

                            /** Guest are evenly distributed based on the maxLimit or 
                             *  No max limit was defined in ruleset
                             */
                        } else {
                            if (occupantNum >= maxLimit) {
                                var i = 1;
                                do {
                                    addRoom({
                                        [guest]: maxLimit
                                    });
                                    i++;
                                } while (i <= numOfBkRoom);
                            } else {
                                addRoom({
                                    [guest]: occupantNum
                                });
                            }

                        }
                        /** Explained at the Booking Qualification Engine at line 77*/
                    } else if (notEnough) {
                        addError(`Not enough ${guest} guest`);
                        return res.json(resultBooking);
                    } else if (occupantNum == 0){
                        addError("Invalid data");
                        return res.json(resultBooking);
                    } else if (tooMuch) {

                        addError(`Too much ${guest}s guest`);
                        return res.json(resultBooking);

                    } else if (occupantNum > BOOK_LIMIT[guest]) {

                        addError(`Exceed limit of ${BOOK_LIMIT[guest]} ${guest}s per booking`);
                        return res.json(resultBooking);

                        /** default is to add everyone into the room */
                    } else if (isNaN(occupantNum)){
                        addError("Bad data");
                        return res.json(resultBooking);
                    } else {
                        addRoom({
                            [guest]: occupantNum
                        });
                    }
                    break;

                    /** Check for children */
                case ROOM_OCCUPANTS[1]:
                    let additionalRoom = 0;
                
                    if (needMultipleRooms && occupantNum > 0) {
                        numOfBkRoom = Math.ceil(occupantNum / maxLimit);
                        
                        /**
                         * The statement encompassed inside the "if" below is to check whether to update the current
                         * rooms mapping or not. If yes update else leave it as it is.
                         */
                        if(numOfBkRoom > resultBooking.booking.rooms.length){
                            additionalRoom = numOfBkRoom - resultBooking.booking.rooms.length;
                            if(totalParent >= numOfBkRoom * minParentLimit.value){
                                if(totalParent == numOfBkRoom * minParentLimit.value){
                                    var i = 1;
                                    resetRoom();
                                    do {
                                        addRoom({[minParentLimit.entityType]: minParentLimit.value});
                                        i++;
                                    } while (i <= numOfBkRoom);
                                }else{
                                    let firstRoomParentAmount = checkGuestFirstRoom(minParentLimit.entityType);
                                    let realFirstRoomParentAmount = firstRoomParentAmount - additionalRoom * minParentLimit.value;
                                    addGuest(minParentLimit.entityType,Math.ceil(realFirstRoomParentAmount),0);
                                    var i = 1;
                                    do {
                                        addRoom({[minParentLimit.entityType]: minParentLimit.value});
                                        i++;
                                    } while (i <= additionalRoom);
                                }
                            }else{
                                addError(`Not enough ${minParentLimit.entityType} guest`);
                                return res.json(resultBooking);
                            }
                        }

                        /** 
                         * COMMENT: similar process to adults but they could only be
                         *  added to rooms not book a new.
                         */

                        let remainGuestNum = occupantNum % maxLimit;
                        let excludingFirstRoomOfBkRoom = numOfBkRoom - 1;
                        if (remainGuestNum != 0) {
                            var i = 1;
                            do {
                                addGuest(guest, maxLimit, i-1);
                                i++;
                            } while (i <= excludingFirstRoomOfBkRoom);
                            addGuest(guest, remainGuestNum, excludingFirstRoomOfBkRoom);
                        } else {
                            if (occupantNum >= maxLimit) {
                                var i = 1;
                                do {
                                    addGuest(guest, maxLimit, i-1);
                                    i++;
                                } while (i <= numOfBkRoom);
                            } else if (occupantNum === 0) {
                                addError("Missing data from client");
                                return res.json(resultBooking);
                            } else {
                                addGuest(guest, occupantNum, 0);
                            }
                        }

                        /** Explained at the Booking Qualification Engine at line 77*/
                    } else if (occupantNum == 0){
                        addError("Invalid data");
                        return res.json(resultBooking);
                    } else if (notEnoughParent) {

                        addError("Minor must be accompanied by one adult");
                        return res.json(resultBooking);
                    } else if (tooMuchParent) {

                        addError(`Too much ${minParentLimit.occupantType}s guest`);
                        return res.json(resultBooking);
                    } else if (isNaN(occupantNum)){
                        addError("Bad data");
                        return res.json(resultBooking);
                        /** default is to add everyone into the room */
                    } else {
                        addGuest(guest, occupantNum,0);
                    }
                    break;
                case ROOM_OCCUPANTS[2]:
                    /** Check for infant */
                    additionalRoom = 0;

                    /**
                    * The statement encompassed inside the "if" below is to check whether to update the current
                    * rooms mapping or not. If yes update else leave it as it is.
                    */
                    if (needMultipleRooms && occupantNum > 0) {
                        numOfBkRoom = Math.ceil(occupantNum / maxLimit);
                       
                        if(numOfBkRoom > resultBooking.booking.rooms.length){
                            additionalRoom = numOfBkRoom - resultBooking.booking.rooms.length;
                            if(totalParent >= numOfBkRoom * minParentLimit.value){
                                if(totalParent == numOfBkRoom * minParentLimit.value){
                                    var i = 1;
                                    resetRoom();
                                    do {
                                        addRoom({[minParentLimit.entityType]: minParentLimit.value});
                                        i++;
                                    } while (i <= numOfBkRoom);
                                }else{
                                    let firstRoomParentAmount = checkGuestFirstRoom(minParentLimit.entityType);
                                    let realFirstRoomParentAmount = firstRoomParentAmount - additionalRoom * minParentLimit.value;
                                    addGuest(minParentLimit.entityType,Math.ceil(realFirstRoomParentAmount),0);
                                    var i = 1;
                                    do {
                                        addRoom({[minParentLimit.entityType]: minParentLimit.value});
                                        i++;
                                    } while (i <= additionalRoom);
                                }
                            }else{
                                addError(`Not enough ${minParentLimit.entityType} guest`);
                                return res.json(resultBooking);
                            }
                        }

                         /** 
                         * COMMENT: similar process to adults but they could only be
                         *  added to rooms not book a new.
                         */
                        let remainGuestNum = occupantNum % maxLimit;
                        let excludingFirstRoomOfBkRoom = numOfBkRoom - 1;
                        if (remainGuestNum != 0) {
                            numOfBkRoom = occupantNum / maxLimit;
                            var i = 1;
                            do {
                                addGuest(guest, maxLimit, i-1);
                                i++;
                            } while (i <= numOfBkRoom - 1);
                            addGuest(guest, remainGuestNum, excludingFirstRoomOfBkRoom);
                        } else {
                            if (occupantNum >= maxLimit) {
                                numOfBkRoom = occupantNum / maxLimit;
                                var i = 1;
                                do {
                                    addGuest(guest, maxLimit, i-1);
                                    i++;
                                } while (i <= numOfBkRoom);
                            } else if (occupantNum === 0) {
                                addError("Missing data from client");
                                return res.json(resultBooking);
                            } else {
                                addGuest(guest, occupantNum, 0);
                            }
                        }

                        /** Explained at the Booking Qualification Engine at line 77*/
                    } else if (occupantNum == 0){
                        addError(["Invalid data"]);
                        return res.json(resultBooking);
                    } else if (notEnoughParent) {
                        addError("Minor must be accompanied by one adult");
                        return res.json(resultBooking);
                    } else if (tooMuchParent) {
                        addError(`Too much ${minParentLimit.occupantType}s guest`);
                        return res.json(resultBooking);
                    } else if (isNaN(occupantNum)){
                        addError("Bad data");
                        return res.json(resultBooking);
                        /** default is to add everyone into the room */
                    } else {
                        addGuest(guest, occupantNum, 0);
                    }
                    break;
                default:
                    /** Consumer JSON doesn't align with this application rule set */
                    addError("Unknown Rule");
                    break;
            }

        }
    }

    return res.json(resultBooking);

}