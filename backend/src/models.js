import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    description: {
        type: String,
    },
    category: {
        type: [String],
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isOrdered: {
        type: Boolean,
        default: false,
    }
});

const itemModel = mongoose.model('Item', itemSchema);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: 'Anonymous',
        required: [true, "First name is required."],
        minLength: [1, "First name must not be empty."],
    },
    lastName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: [true, 'Email is already in use.'],
        match: [
            /^[a-zA-Z0-9._%+-]+@[\w]+.[\w]+$/,
            'Invalid email.',
        ],
    },
    age: {
        type: Number,
    },
    contactNumber: {
        type: Number,
        min: 6000000000,
        max: 9999999999,
    },
    passwordHash: {
        type: String,
    },
    itemsInCart: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        }],
        default: [],
    },
    sellerReviews: {
        type: [{
            review: {
                type: String,
                required: true,
            },
            reviewer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        }],
        default: [],
    },
});

const userModel = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'cancelled'],
        default: 'pending',
    }
});

const orderModel = mongoose.model('Order', orderSchema);

export { itemModel, userModel, orderModel };
