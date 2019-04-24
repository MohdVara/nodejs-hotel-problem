import chai, {
    expect
} from "chai";
import sinonChai from 'sinon-chai';
import {
    checkLink,
    booking
} from '../src/controllers/ApiController';
import {
    mockReq,
    mockRes
} from 'sinon-express-mock';

chai.use(sinonChai);

let res,req = {};

describe("Initial suite test", () => {

    it('API return message', () => {
        const request = mockReq(req);
        const response = mockRes();
        checkLink(request, response);
        expect(response.json)
            .to.be.calledWith({
                message: "API Endpoint"
            });
    });

});

//Return appropriate room with guest number maps.
describe("Problem Statement Test Cases", () => {
    describe("Booking For Rooms (Returns Result)", () => {
        describe("Test With Adults Only", () => {
            it('If 7 adults are booking', () => {
                req.body = {
                    bookings: {
                        adult: 7,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3
                            },
                            {
                                adult: 3
                            },
                            {
                                adult: 1
                            }
                        ]
                    }
                });
            });

            it('If 5 adults are booking', () => {
                req.body = {
                    bookings: {
                        adult: 5,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3
                            },
                            {
                                adult: 2
                            }
                        ]
                    }
                });
            });

            it('If 6 adults are booking', () => {
                req.body = {
                    bookings: {
                        adult: 6,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3
                            },
                            {
                                adult: 3
                            }
                        ]
                    }
                });
            });

            it('If 3 adults are booking', () => {
                req.body = {
                    bookings: {
                        adult: 3,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                            adult: 3
                        }, ]
                    }
                });
            });
        });

        describe("Test With Adults And Children Only", () => {

            it("If 6 adults with 1 child are booking", () => {
                req.body = {
                    bookings: {
                        adult: 6,
                        children: 1,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3,
                                children: 1
                            },
                            {
                                adult: 3
                            },
                        ]
                    }
                });
            });

            it("If 4 adults with 2 child are booking", () => {
                req.body = {
                    bookings: {
                        adult: 4,
                        children: 2,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3,
                                children: 2
                            },
                            {
                                adult: 1
                            },
                        ]
                    }
                });
            });

            it("If 3 adults with 3 child are booking", () => {
                req.body = {
                    bookings: {
                        adult: 3,
                        children: 1,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                            adult: 3,
                            children: 1
                        }, ]
                    }
                });
            });
        });

        describe("Test With Adults And Infants", () => {
            it("If 6 adults with 1 infant are booking", () => {
                req.body = {
                    bookings: {
                        adult: 6,
                        infant: 1,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3,
                                infant: 1
                            },
                            {
                                adult: 3
                            },
                        ]
                    }
                });
            });

            it("If 4 adults with 3 infant are booking", () => {
                req.body = {
                    bookings: {
                        adult: 4,
                        infant: 3,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3,
                                infant: 3
                            },
                            {
                                adult: 1
                            },
                        ]
                    }
                });
            });

            it("If 3 adults with 2 infant are booking", () => {
                req.body = {
                    bookings: {
                        adult: 3,
                        infant: 2,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                            adult: 3,
                            infant: 2
                        }, ]
                    }
                });
            });
        });

        describe("Test With Adults,Children and Infants", () => {
            it("If 6 adults, 2 children and 4 infant are booking", () => {
                req.body = {
                    bookings: {
                        adult: 6,
                        children: 2,
                        infant: 4,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3,
                                children: 2,
                                infant: 4
                            },
                            {
                                adult: 3
                            },
                        ]
                    }
                });
            });

            it("If 4 adults,3 child and 3 infants are booking", () => {
                req.body = {
                    bookings: {
                        adult: 4,
                        children: 3,
                        infant: 3,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                                adult: 3,
                                children: 3,
                                infant: 3
                            },
                            {
                                adult: 1
                            },
                        ]
                    }
                });
            });

            it("If 3 adults, 1 child and  2 infants are booking", () => {
                req.body = {
                    bookings: {
                        adult: 3,
                        children: 1,
                        infant: 2,
                    }
                };
                const request = mockReq(req);
                const response = mockRes();
                booking(request, response);
                expect(response.json).to.be.calledWith({
                    booking: {
                        rooms: [{
                            adult: 3,
                            children: 1,
                            infant: 2
                        }, ]
                    }
                });
            });
        });

    });


    describe("Booking For Rooms (Returns Error)", () => {
        it("If 8 adults are booking (Overcapacity Error)", () => {
            req.body = {
                bookings: {
                    adult: 8,
                }
            };
            const request = mockReq(req);
            const response = mockRes();
            booking(request, response);
            expect(response.json).to.be.calledWith({
                error: ["Exceed limit of 7 adults per booking"]
            });
        });

        it("If 0 adults are booking (Not enough adult)", () => {
            req.body = {
                bookings: {
                    adult: 0,
                }
            };
            const request = mockReq(req);
            const response = mockRes();
            booking(request, response);
            expect(response.json).to.be.calledWith({
                error: ["Not enought adult guest"]
            });
        });

        it("If a child is booking (Unaccompanied Minor Error)", () => {
            req.body = {
                bookings: {
                    children: 1,
                }
            };
            const request = mockReq(req);
            const response = mockRes();
            booking(request, response);
            expect(response.json).to.be.calledWith({
                error: ["Minor must be accompanied by one adult"]
            });
        });

        it("If an infant is booking (Unaccompanied Minor Error)", () => {
            req.body = {
                bookings: {
                    infant: 1,
                }
            };
            const request = mockReq(req);
            const response = mockRes();
            booking(request, response);
            expect(response.json).to.be.calledWith({
                error: ["Minor must be accompanied by one adult"]
            });
        });
    });
});

describe("Small Constraint Engine Test Cases", () => {
    describe("Checking Current Rule", () => {
        it("Check if application blocks empty request", () => {
            req.body = {};
            const request = mockReq(req);
            const response = mockRes();
            booking(request, response);
            expect(response.json).to.be.calledWith({
                error: ["Missing data from client"]
            });
        });

        it("Check if application blocks incomplete request", () => {
            req.body = {
                "bookings":{
                    
                }
            };
            const request = mockReq(req);
            const response = mockRes();
            booking(request, response);
            expect(response.json).to.be.calledWith({
                error: ["Missing data from client"]
            });
        });
        
        it("Check if engine follows application ruleset", () => {
            req.body = {
                bookings: {
                    ghost: 1,
                }
            };
            const request = mockReq(req);
            const response = mockRes();
            booking(request, response);
            expect(response.json).to.be.calledWith({
                error: ["Ruleset defective"]
            });
        });
    });
});