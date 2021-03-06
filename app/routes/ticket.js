let Ticket = require('../models/ticket');
const ACCEPTED_GENDERS = ["MALE", "FEMALE", "OTHER"]

/*
 * GET /ticket/:seat/status route to View Ticket Status.
 */
function getTicketStatus(req, res) {
	//Query the DB and if no errors, send the ticket
	Ticket.findOne({seat: req.params.seat}, (err, ticket) => {
		if(err) res.send(err);
		else if(!ticket) res.status(404).send({message: "No seat found for this seat number."})
		else {
			if(ticket.booked) res.json({message: "The ticket is booked", booked: ticket.booked});
			else res.json({message: "The ticket is not yet booked", booked: ticket.booked});
		}
	});
}

/*
 * GET /ticket/:seat route to View Details of person owning the ticket.
 */
function getTicket(req, res) {
	//Query the DB and if no errors, send the ticket
	Ticket.findOne({seat: req.params.seat}, (err, ticket) => {
		if(err) res.send(err);
		else if(!ticket) res.status(404).send({message: "No seat found for this seat number."})
		else {
			res.json(ticket)
		}
	});
}

/*
 * PUT /ticket/:seat route to Update the ticket status (open/close + adding user details).
 */
function updateTicket(req, res) {
	newTicket = req.body
	// console.log("newTicket", newTicket)
	if (!Object.keys(newTicket).length) {
		return res.status(422).send({message: "Please send proper body"})
	}
	//Check if gender is proper
	if (newTicket.customer_gender && ACCEPTED_GENDERS.indexOf(newTicket.customer_gender) == -1) {
		return res.status(422).send({message: "Please send proper gender", ACCEPTED_GENDERS})
	}
	//Query the DB and if no errors, update the ticket
	Ticket.findOne({seat: req.params.seat}, (err, ticket) => {
		if(err) res.send(err);
		else if(!ticket) res.status(404).send({message: "No seat found for this seat number."})
		else if(ticket.booked && newTicket.booked) res.status(420).send({message: "Ticket is already booked"})
		else {
			if(ticket.booked && !newTicket.booked){
				newTicket.customer_name = null
				newTicket.customer_age = null
				newTicket.customer_gender = null
			}
			Object.assign(ticket, newTicket).save((err, ticket) => {
				if(err) res.send(err);
				else res.json({ message: 'ticket updated!', ticket });
			});	
		}
	});
}

/*
 * GET /closed-tickets route to View all closed tickets
 */
function viewClosedTickets(req, res) {
	//Query the DB and if no errors, update the ticket
	Ticket.find({booked: true}, (err, tickets) => {
		if(err) res.send(err);
		else res.json(tickets)
	});
}

/*
 * GET /open-ticket route to View all open tickets
 */
function viewOpenTickets(req, res) {
	//Query the DB and if no errors, update the ticket
	Ticket.find({booked: false}, (err, tickets) => {
		if(err) res.send(err);
		else res.json(tickets)
	});
}

/*
 * POST /admin/reset-server route to Additional API for admin to reset the server (opens up all the tickets) 
 */
function resetServer(req, res) {
	Ticket.remove({}, (err) => { 
		if(err) res.send(err);
		// else res.json({})
		else {
			for(i=1;i<=40;i++){
				let ticket = new Ticket({bus: "MyBus", seat: i, booked: false, customer_details:{} })
			  	ticket.save((err, ticketIns) => {
					if(err) res.send(err);
				})
			}
			res.json({message: "ticket reset successful"})
		}
	});
}

//export all the functions
module.exports = { getTicketStatus, getTicket, updateTicket, viewClosedTickets, viewOpenTickets, resetServer };