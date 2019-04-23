
import chai, { expect } from "chai";
import sinonChai from 'sinon-chai';
import { checkLink, booking } from '../src/controllers/ApiController';
import { mockReq, mockRes } from 'sinon-express-mock';

chai.use(sinonChai);

let res = {
    result: '',
    json: function(args,args1) {
        this.result = args1;
    }
};
let req = {body:''};

describe("Initial suite test",() => {
    
    it('API return message', () => {
        const request = mockReq(req);
        const response = mockRes();
        checkLink(request, response);
        expect(response.json)
        .to.be.calledWith({ message: "API Endpoint" });
    });

});

//Return appropriate room with guest number maps.
describe("Booking For Rooms (Returns Result)",() => {
    
    it('If 7 adults are booking', () => {
        req.body = {
            "bookings": {
                "adult": 7,
            }
        };
        const request = mockReq(req);
        const response = mockRes();
        booking(request, response);
        expect(response.json).to.be.calledWith({
            booking:{
                rooms: [
                    { adult: 3 },
                    { adult: 3 },
                    { adult: 1}
                ]
            }
        });
    });

    it('If 5 adults are booking', () => {
        req.body = {
            "bookings": {
                "adult": 5,
            }
        };
        const request = mockReq(req);
        const response = mockRes();
        booking(request, response);
        expect(response.json).to.be.calledWith({
            booking:{
                rooms: [
                    { adult: 3 },
                    { adult: 2 }
                ]
            }
        });
    });

    it('If 3 adults are booking', () => {
        req.body = {
            "bookings": {
                "adult": 3,
            }
        };
        const request = mockReq(req);
        const response = mockRes();
        booking(request, response);
        expect(response.json).to.be.calledWith({
            booking:{
                rooms: [
                    { adult: 3 },
                ]
            }
        });
    });

    it("If 3 adults with 1 child are booking",() => {
        req.body = {
            "bookings": {
                "adult": 3,
                "children":1,
            }
        };
        const request = mockReq(req);
        const response = mockRes();
        booking(request, response);
        expect(response.json).to.be.calledWith({
            booking:{
                rooms: [
                    { adult: 3 , children: 1},
                ]
            }
        });
    });
});


describe("Booking For Rooms (Returns Error)",() => {
    it("If 8 adults are booking (Overcapacity Error)",() => {
        req.body = {
            "bookings": {
                "adult": 8,
            }
        };
        const request = mockReq(req);
        const response = mockRes();
        booking(request, response);
        expect(response.json).to.be.calledWith({
            error: ["Exceed limit of 7 adults per booking"]
        });
    });

    it("If a child is booking (Unaccompanied Minor Error)",() => {
        req.body = {
            "bookings": {
                "children": 1,
            }
        };
        const request = mockReq(req);
        const response = mockRes();
        booking(request, response);
        expect(response.json).to.be.calledWith({
            error: ["Minor must be accompanied by one adult"]
        });
    });

    it("If an infant is booking (Unaccompanied Minor Error)",() => {
        req.body = {
            "bookings": {
                "infant": 1,
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

