const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDb } = require('./db');
const { registrationModel, BookingModel, HotelModel } = require('./Schema');

connectDb();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Server is Running successfully');
});

app.post('/registration', async (req, res) => {
    try {
        const dbResponse = await registrationModel.create(req.body);
        if (dbResponse._id) {
            res.status(201).send(dbResponse);
        } else {
            res.status(400).send('Error creating user');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/login', async (req, res) => {
    const { username, password } = req.query;
    try {
        const dbResponse = await registrationModel.findOne({ username, password });
        if (dbResponse?._id) {
            res.send(dbResponse.username);
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/createBooking', async (req, res) => {
    const { selectedDate, selectedHotel, selectedSeats, selectedSlot, username } = req.body;

    if (selectedDate && selectedHotel && selectedSeats > 0 && selectedSlot && username) {
        try {
            const response = await BookingModel.create({
                selectedDate,
                selectedHotel,
                selectedSeats,
                selectedSlot,
                username,
                isCancelled: false,
            });
            res.status(201).send('Booking Created Successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating booking');
        }
    } else {
        res.status(400).send('Invalid booking data');
    }
});

app.get('/mybookings', async (req, res) => {
    const username = req.query.username || '';
    try {
        const response = await BookingModel.find({ username, isCancelled: false });
        if (response.length) {
            res.send(response);
        } else {
            res.status(404).send('No bookings found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/cancelBooking', async (req, res) => {
    const { bookingId } = req.body;
    try {
        const dbResponse = await BookingModel.findOneAndUpdate(
            { _id: bookingId },
            { isCancelled: true },
            { new: true } // Return the updated document
        );
        if (dbResponse) {
            res.send('Cancelled Booking');
        } else {
            res.status(404).send('Booking not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/fetchHotels', async (req, res) => {
    const { location } = req.query;
    try {
        const response = await HotelModel.findOne({ _id: '664b6eb4d38a3ffdc14dd78b' });
        res.send(response[location]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
