let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//ticket schema definition
let TicketSchema = new Schema(
  {
    bus: { type: String, required: true },
    seat: { type: Number, required: true },
    booked: { type: Boolean, required: true },
    customer_name: { type: String },
    customer_age: { type: Number },
    customer_gender: { type: String },
    created_at: { type: Date, default: Date.now },
  }, 
  { 
    versionKey: false
  }
);

// Sets the created_at parameter equal to the current time
TicketSchema.pre('save', next => {
  now = new Date();
  if(!this.created_at) {
    this.created_at = now;
  }
  next();
});

//Exports the TicketSchema for use elsewhere.
module.exports = mongoose.model('ticket', TicketSchema);