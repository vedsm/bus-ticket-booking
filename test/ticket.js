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
describe('BusTickets', () => {
	beforeEach((done) => { //Before each test we reset the database
		// Ticket.remove({}, (err) => { 
		// 	done();
		// });
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
					"customer_gender": "Male"
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
				  	res.body.should.have.property('message').eql('ticket updated!');
				  	res.body.ticket.should.have.property('booked').eql(true);
				  	res.body.ticket.should.have.property('customer_name').eql('Ved M');
				  	res.body.ticket.should.have.property('customer_age').eql(42);
				  	res.body.ticket.should.have.property('customer_gender').eql('Male');
					done();
				});
		});
	});

	describe('GET /closed-tickets', () => {
		it('it should View all closed tickets', (done) => {
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
		it('it should View all open tickets', (done) => {
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
});
