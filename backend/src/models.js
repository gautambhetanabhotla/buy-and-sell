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
    category: [
        {
            type: String,
        },
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const itemModel = mongoose.model('Item', itemSchema);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: 'John',
    },
    lastName: {
        type: String,
        default: 'Doe',
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@(students|research)*\.iiit\.ac\.in$/,
            'Invalid/non-IIIT email',
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
    itemsInCart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
    ],
    sellerReviews: [
        {
            type: mongoose.Schema.Types.Object,
            properties: {
                review: {
                    type: String,
                    required: true,
                },
                reviewer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
            },
        },
    ],
});

const userModel = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
});

const orderModel = mongoose.model('Order', orderSchema);

export { itemModel, userModel, orderModel };
