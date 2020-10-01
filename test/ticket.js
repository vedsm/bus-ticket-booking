//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let Ticket = require('../app/models/ticket');

chai.use(chaiHttp);
//Our parent block
describe('BusTickets functionality test', () => {
	beforeEach((done) => { //Before each test we reset the database
		chai.request(server)
			.post('/admin/reset-server')
			.end((err, res) => {
				done();
			});
	});
	describe('GET /ticket/:seat/status', () => {
		it('it should View Ticket Status', (done) => {
			chai.request(server)
				.get('/ticket/1/status')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('The ticket is not yet booked');
				  	res.body.should.have.property('booked').eql(false);
					done();
				});
		});
	});

	describe('GET /ticket/:seat', () => {
		it('it should View Details of person owning the ticket.', (done) => {
			chai.request(server)
				.get('/ticket/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('booked').eql(false);
					done();
				});
		});
	});

	describe('PUT /ticket/:seat', () => {
		it('it should Update the ticket status (open/close + adding user details)', (done) => {
			chai.request(server)
				.put('/ticket/1')
			    .send({
					"booked": true,
					"customer_name": "Ved M",
					"customer_age": 42,
					"customer_gender": "MALE"
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('ticket updated!');
				  	res.body.ticket.should.have.property('booked').eql(true);
				  	res.body.ticket.should.have.property('customer_name').eql('Ved M');
				  	res.body.ticket.should.have.property('customer_age').eql(42);
				  	res.body.ticket.should.have.property('customer_gender').eql('MALE');
					done();
				});
		});
	});
	
	describe('GET /ticket/:seat/status of wrong seat number', () => {
		it('it should return Ticket Not found error', (done) => {
			chai.request(server)
				.get('/ticket/619/status')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('No seat found for this seat number.');
					done();
				});
		});
	});

	describe('GET /ticket/:seat of wrong seat number', () => {
		it('it should return Ticket Not found error', (done) => {
			chai.request(server)
				.get('/ticket/2020')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('No seat found for this seat number.');
					done();
				});
		});
	});

	describe('PUT /ticket/:seat of wrong seat number', () => {
		it('it should return Ticket Not found error', (done) => {
			chai.request(server)
				.put('/ticket/10101')
			    .send({
					"booked": true,
					"customer_name": "Ved M",
					"customer_age": 42,
					"customer_gender": "MALE"
				})
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('No seat found for this seat number.');
					done();
				});
		});
	});

	describe('PUT /ticket/:seat with empty body', () => {
		it('it should throw error', (done) => {
			chai.request(server)
				.put('/ticket/1')
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					done();
				});
		});
	});

	describe('PUT /ticket/:seat with wrong gender', () => {
		it('it should throw error when update the ticket with wrong gender string', (done) => {
			chai.request(server)
				.put('/ticket/1')
			    .send({
					"booked": true,
					"customer_name": "Ved M",
					"customer_age": 42,
					"customer_gender": "wqygsdhbsahjbcsa"
				})
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					done();
				});
		});
	});

	describe('GET /closed-tickets', () => {
		it('it should View all closed tickets. Ticket count should be 0.', (done) => {
			chai.request(server)
				.get('/closed-tickets')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	describe('GET /open-tickets', () => {
		it('it should View all open tickets. Ticket count should be 40.', (done) => {
			chai.request(server)
				.get('/open-tickets')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(40);
					done();
				});
		});
	});

	describe('POST /admin/reset-server', () => {
		it('it should Reset the server (opens up all the tickets) ', (done) => {
			chai.request(server)
				.post('/admin/reset-server')
				.end((err, res) => {
					res.should.have.status(200);
				  	res.body.should.have.property('message').eql('ticket reset successful');
					done();
				});
		});
	});

	describe('BusTickets functionality test after some booked tickets', () => {
		beforeEach((done) => {
			chai.request(server)
				.put('/ticket/1')
				.send({
					"booked": true,
					"customer_name": "Sanchit Mehta",
					"customer_age": 26,
					"customer_gender": "MALE"
				})
				.end((err, res) => {
					// done();
					chai.request(server)
						.put('/ticket/3')
						.send({
							"booked": true,
							"customer_name": "Geetika Mehndiratta",
							"customer_age": 24,
							"customer_gender": "FEMALE"
						})
						.end((err, res) => {
							// done();
							chai.request(server)
								.put('/ticket/7')
								.send({
									"booked": true,
									"customer_name": "Ved M",
									"customer_age": 42,
									"customer_gender": "MALE"
								})
								.end((err, res) => {
									done();
								});
						});
				});
		});
		describe('GET /ticket/:seat/status for booked ticket', () => {
			it('it should View Ticket Status of booked ticket', (done) => {
				chai.request(server)
					.get('/ticket/1/status')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						  res.body.should.have.property('message').eql('The ticket is booked');
						  res.body.should.have.property('booked').eql(true);
						done();
					});
			});
		});
		describe('GET /ticket/:seat for booked ticket', () => {
			it('it should show details of person owning the ticket.', (done) => {
				chai.request(server)
					.get('/ticket/1')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('booked').eql(true);
						res.body.should.have.property('customer_name').eql('Sanchit Mehta');
						res.body.should.have.property('customer_age').eql(26);
						res.body.should.have.property('customer_gender').eql('MALE');
						done();
					});
			});
		});
		describe('PUT /ticket/:seat for booked ticket', () => {
			it('it should Update the ticket status: It will open a booked ticket', (done) => {
				chai.request(server)
					.put('/ticket/1')
					.send({
						"booked": false,
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('ticket updated!');
						res.body.ticket.should.have.property('booked').eql(false);
						done();
					});
			});
		});
		describe('PUT /ticket/:seat for booked ticket', () => {
			it('it should throw an error when an already booked ticket is booked again', (done) => {
				chai.request(server)
					.put('/ticket/1')
					.send({
						"booked": true,
						"customer_name": "Picachu",
						"customer_age": 5,
						"customer_gender": "OTHER"
					})
					.end((err, res) => {
						res.should.have.status(420);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Ticket is already booked');
						done();
					});
			});
		});

		describe('GET /closed-tickets after booked ticket', () => {
			it('it should View all closed tickets. Ticket count should be 3.', (done) => {
				chai.request(server)
					.get('/closed-tickets')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(3);
						done();
					});
			});
		});

		describe('GET /open-tickets after booked ticket', () => {
			it('it should View all open tickets. Ticket count should be 37.', (done) => {
				chai.request(server)
					.get('/open-tickets')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(37);
						done();
					});
			});
		});
		describe('BusTickets functionality test after some tickets are booked and then cancelled', () => {
			beforeEach((done) => {
				chai.request(server)
					.put('/ticket/7')
					.send({
						"booked": false,
					})
					.end((err, res) => {
						done();
					});
			});

			describe('GET /ticket/:seat/status for booked & cancelled ticket', () => {
				it('it should View Ticket Status of booked & cancelled ticket', (done) => {
					chai.request(server)
						.get('/ticket/7/status')
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							  res.body.should.have.property('message').eql('The ticket is not yet booked');
							  res.body.should.have.property('booked').eql(false);
							done();
						});
				});
			});

			describe('GET /ticket/:seat for booked & cancelled ticket', () => {
				it('it should show ticket as not booked without customer details.', (done) => {
					chai.request(server)
						.get('/ticket/7')
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('booked').eql(false);
							res.body.should.have.property('customer_name').eql(null);
							res.body.should.have.property('customer_age').eql(null);
							res.body.should.have.property('customer_gender').eql(null);
							done();
						});
				});
			});

			describe('PUT /ticket/:seat for booked & cancelled ticket', () => {
				it('it should Update the ticket status: It will book a booked & cancelled ticket', (done) => {
					chai.request(server)
						.put('/ticket/7')
						.send({
							"booked": true,
							"customer_name": "Gandalf",
							"customer_age": 500,
							"customer_gender": "MALE"
						})
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('message').eql('ticket updated!');
							res.body.ticket.should.have.property('booked').eql(true);
							done();
						});
				});
			});

			describe('GET /closed-tickets after booked & cancelled ticket', () => {
				it('it should View all closed tickets. Ticket count should be 2.', (done) => {
					chai.request(server)
						.get('/closed-tickets')
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('array');
							res.body.length.should.be.eql(2);
							done();
						});
				});
			});
	
			describe('GET /open-tickets after booked & cancelled ticket', () => {
				it('it should View all open tickets. Ticket count should be 38.', (done) => {
					chai.request(server)
						.get('/open-tickets')
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('array');
							res.body.length.should.be.eql(38);
							done();
						});
				});
			});
			describe('BusTickets functionality test of admin reset after a buch of ticket bookings and cancellations.', () => {
				beforeEach((done) => {
					chai.request(server)
						.post('/admin/reset-server')
						.end((err, res) => {
							done();
						});
				});
				describe('GET /ticket/:seat/status for booked ticket', () => {
					it('it should View Ticket Status of booked ticket', (done) => {
						chai.request(server)
							.get('/ticket/1/status')
							.end((err, res) => {
								res.should.have.status(200);
								res.body.should.be.a('object');
								  res.body.should.have.property('message').eql('The ticket is not yet booked');
								  res.body.should.have.property('booked').eql(false);
								done();
							});
					});
				});
				describe('GET /ticket/:seat for booked ticket', () => {
					it('it should show details of person owning the ticket.', (done) => {
						chai.request(server)
							.get('/ticket/1')
							.end((err, res) => {
								res.should.have.status(200);
								res.body.should.be.a('object');
								res.body.should.have.property('booked').eql(false);
								done();
							});
					});
				});
				describe('GET /closed-tickets after admin reset after a buch of ticket bookings and cancellations.', () => {
					it('it should View all closed tickets. . Ticket count should be 0.', (done) => {
						chai.request(server)
							.get('/closed-tickets')
							.end((err, res) => {
								res.should.have.status(200);
								res.body.should.be.a('array');
								res.body.length.should.be.eql(0);
								done();
							});
					});
				});
		
				describe('GET /open-tickets after admin reset after a buch of ticket bookings and cancellations.', () => {
					it('it should View all open tickets. Ticket count should be 40.', (done) => {
						chai.request(server)
							.get('/open-tickets')
							.end((err, res) => {
								res.should.have.status(200);
								res.body.should.be.a('array');
								res.body.length.should.be.eql(40);
								done();
							});
					});
				});
			})
		})
	});
});
