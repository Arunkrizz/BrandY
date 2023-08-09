const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({
  deliveryDetails: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: String,
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Assuming you have a User model defined
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // You can set a default quantity if needed
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['placed','pending', 'shipped', 'delivered','cancelled'],
    default: 'pending',
  },
  date: {
    type: String,
    default: () => {
      const currentDate = new Date();
      const options = {
        weekday: 'short', // Short weekday name (e.g., Mon)
        month: 'short',   // Short month name (e.g., Jul)
        day: 'numeric',   // Day of the month (e.g., 31)
        year: 'numeric',  // Full year (e.g., 2023)
      };
      return currentDate.toLocaleDateString('en-US', options);
    },
  },
  // Add more properties as needed
});

orderSchema.pre('save', function (next) {
  const dateOptions = {
    weekday: 'short', // Short weekday name (e.g., Mon)
    month: 'short',   // Short month name (e.g., Jul)
    day: 'numeric',   // Day of the month (e.g., 31)
    year: 'numeric',  // Full year (e.g., 2023)
  };
  this.date = new Date(this.date).toLocaleDateString('en-US', dateOptions);
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
