# Hotel Problem API solution

This project was for an interview question. It the hotel problem constraint.

## Getting Started

Clone the repository and traverse to it's directory to view the code and
run the commands.
<br>
### Prerequisites

####General dependencies
It's paramount to have npm installed in your computer.

####Windows
Make sure you have "win-node-env" installed for the command available
in JSON


```
npm install --save-dev win-node-env
```
<br>
### Installing

Run the following command to install the dependecies of
the application :

```
npm install
```
<br>
###Demonstration
Once the dependencies are installed run the following command:

```
npm run-script prod
```
You should see this page when it's loaded correctly.
<img src="https://i.imgur.com/7DqyKtY.png"
     alt="Hotel Problem front-end"
     style="float: left; margin-right: 10px;" />

This will build and run the server in production mode.

To test whether the endpoints are setup correctly. Using you browser enter
the link http://localhost:3000/api

It should return 
```
{"message":"API Endpoint"}
```
This will verify that your project folder is complete and basic Express.js function are working.

When no issues arised it's time to test the real problem statement:

Example input
```
{
	"bookings":{
            "adult": 6,
            "children":2,
            "infant": 1
	}
}
```
Send a POST request to http://localhost:3000/api/booking

It will show this as the output:
```
{
    "booking": {
        "rooms": [
            {
                "adult": 3,
                "children": 2,
                "infant": 1
            },
            {
                "adult": 3
            }
        ]
    }
}
```

## Running the tests

To run test just run the following command: 
```
npm test
```

It should show that all test passed as shown below:
```
  Initial suite test
    √ API return message

  Problem Statement Test Cases
    Booking For Rooms (Returns Result)
      Test With Adults Only
        √ If 7 adults are booking
        √ If 5 adults are booking
        √ If 6 adults are booking
        √ If 3 adults are booking
      Test With Adults And Children Only
        √ If 6 adults with 1 child are booking
        √ If 4 adults with 2 child are booking
        √ If 3 adults with 3 child are booking
      Test With Adults And Infants
        √ If 6 adults with 1 infant are booking
        √ If 4 adults with 3 infant are booking
        √ If 3 adults with 2 infant are booking
      Test With Adults,Children and Infants
        √ If 6 adults, 2 children and 4 infant are booking
        √ If 4 adults,3 child and 3 infants are booking
        √ If 3 adults, 1 child and  2 infants are booking
    Booking For Rooms (Returns Error)
      √ If 8 adults are booking (Overcapacity Error)
      √ If a child is booking (Unaccompanied Minor Error)
      √ If an infant is booking (Unaccompanied Minor Error)

  Small Constraint Engine Test Cases
    Checking Current Rule
      √ Check if application blocks empty request
      √ Check if application blocks incomplete request
      √ Check if engine follows application ruleset


  20 passing (298ms)
```

### Break down into end to end tests

Currently these test are for the api and correctness of
the application based on the problem statement provided.

Extra test cases are for the constraint engine introduced for
rule flexibility sake. The code could be much simpler for the problem 
statemen but to showcase what could be accomplished it this project.

I decided to add a simple constraint parser engine for future reusability for something with similar rules.

## Deployment

** IN PROGRESS **

## Built With

* [Babel](https://babeljs.io/) - next generation JavaScript
* [NodeJS](https://nodejs.org/en/) - The Chrome V8 Javascript engine
* [ExpressJS](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js

* [Mocha](https://mochajs.org/) - Simple, flexible, fun test framework
* [Chai Assertion Library](https://www.chaijs.com/) - BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com//tags). 

## Author

* **Mohd. Paramasvara** - [Software Enginner](http://www.mohdvara.com)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration from the problem statement given
