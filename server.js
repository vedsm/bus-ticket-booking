
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8080;
// let book = require('./app/routes/book');
let ticket = require('./app/routes/ticket');
let config = require('config'); //we load the db location from the JSON files
//db options
let options = { 
				server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection      
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

app.get("/", (req, res) => res.json({message: "Welcome to our Bus Ticket Booking app!"}));

// app.route("/book")
// 	.get(book.getBooks)
// 	.post(book.postBook);
// app.route("/book/:id")
// 	.get(book.getBook)
// 	.delete(book.deleteBook)
// 	.put(book.updateBook);

// Features from the server:
// • View Ticket Status
// • View Details of person owning the ticket.
// • Update the ticket status (open/close + adding user details)
// • View all closed tickets
// • View all open tickets
// • Additional API for admin to reset the server (opens up all the tickets) 

app.route("/ticket/:seat/status")
	.get(ticket.getTicketStatus);

app.route("/ticket/:seat")
	.get(ticket.getTicket)
	.put(ticket.updateTicket);

app.route("/closed-tickets")
	.get(ticket.viewClosedTickets);

app.route("/open-tickets")
	.get(ticket.viewOpenTickets);

app.route("/admin/reset-server")
	.post(ticket.resetServer);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing