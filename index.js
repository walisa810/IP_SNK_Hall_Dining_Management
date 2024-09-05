const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const mongoose = require("mongoose");
const fs = require('fs');
const path = require("path");
const schedule = require('node-schedule');
const port = 3000;
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Dining');
const db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.on('open', () => console.log("Connected to Database"));

// User registration and login data preparation
const userSchema = new mongoose.Schema({
    name: { type: String,required: true },
    id: { type: String,required: true,  unique: true },
    roomno: String ,
    contno: { type: String,required: true },
    password: { type: String,required: true },
    type: { type: Boolean, default: false }  // New field
});

const Users = mongoose.model("students", userSchema);

const adminSchema = new mongoose.Schema({
    name: { type: String,required: true },
    password: { type: String,required: true }
});

const Admins = mongoose.model("admin", adminSchema);

// Lunch table data preparation
function createLunchSchema(daysInMonth) {
    const days = {};
    for (let i = 1; i <= daysInMonth; i++) {
        days[i] = { type: Boolean, default: false };
    }

    return new mongoose.Schema({
        id: String,
        days
    });
}
//meal count table
const mealCountSchema = new mongoose.Schema({
    regular: Number,
    staff: Number,
    extra: Number,
    total: Number,
    date: { type: Date, default: Date.now }
});
const MealCount = mongoose.model('MealCount', mealCountSchema);

const anotherMealCountSchema = new mongoose.Schema({
    regular: Number,
    staff: Number,
    extra: Number,
    total: Number,
    date: { type: Date, default: Date.now }
});
const AnotherMealCount = mongoose.model('AnotherMealCount', anotherMealCountSchema); 
const feastSchema = new mongoose.Schema({
    meals: [String],
    date: Date,
    image: String
});

const Feast = mongoose.model('Feast', feastSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); // Save files to 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save files with unique names
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Handle image upload
app.post('/submit-feast', upload.single('image'), async (req, res) => {
    try {
        console.log('File Data:', req.file);

        const { meals, date } = req.body;
        const imagePath = req.file.filename;

        if (!meals || !date || !imagePath) {
            throw new Error('Missing required fields: meals, date, or image');
        }

        const newFeast = new Feast({
            meals: Array.isArray(meals) ? meals : [meals],
            date: new Date(date),
            image: imagePath // Save just the filename in the database
        });

        await newFeast.save();
        res.status(200).send('Feast details submitted successfully!');
    } catch (error) {
        console.error('Error submitting feast details:', error);
        res.status(500).send('Failed to submit feast details.');
    }
});

const mealSchema = new mongoose.Schema({
    meal: String,
    date: { type: Date, default: Date.now }
});

const Lunchh = mongoose.model('Lunch_menu', mealSchema);
const Dinnerr = mongoose.model('Dinner_menu', mealSchema);

let currentDate = new Date();
let daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
const lunchSchema = createLunchSchema(daysInMonth);

let Lunch;
let Dinner;
if (!mongoose.models.lunch) {
    Lunch = mongoose.model('lunch', lunchSchema);
    Dinner = mongoose.model('dinner', lunchSchema);
} else {
    Lunch = mongoose.models.lunch;
    Dinner = mongoose.models.dinner;
}

// Lunch record update
const resetMealSchema = async () => {
    let currentDate = new Date();
    let daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    try {
        // Reset all entries in the lunch collection that have an ID
        await Lunch.updateMany(
            { id: { $exists: true, $ne: null } },
            {
                $set: Array.from({ length: daysInMonth }, (_, i) => ({ [`days.${i + 1}`]: false }))
                    .reduce((acc, day) => ({ ...acc, ...day }), {})
            }
        );
        await Dinner.updateMany(
            { id: { $exists: true, $ne: null } },
            {
                $set: Array.from({ length: daysInMonth }, (_, i) => ({ [`days.${i + 1}`]: false }))
                    .reduce((acc, day) => ({ ...acc, ...day }), {})
            }
        );
        console.log('Lunch and Dinner records reset successfully');
    } catch (error) {
        console.error('Error resetting lunch records:', error);
    }
};

// Schedule a job to run at midnight on the first day of each month
const job = schedule.scheduleJob('0 0 1 * *', resetMealSchema);

const diningFeeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    currentMonth: { type: Number, required: true ,default:0},
    nextMonth: { type: Number, required: true ,default:0}
});

const DiningFee = mongoose.model('diningfee', diningFeeSchema);

const lateFeeSchema = new mongoose.Schema({
    amountToBePaid: { type: Number, required: true },
    id: { type: String, required: true },
    monthYear: { type: String, required: true }
});

const LateFee = mongoose.model('latefee', lateFeeSchema);

const job1 = schedule.scheduleJob('0 0 1 * *', async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' }) + ' ' + currentDate.getFullYear();
    const prevMonth =  getPrevMonthYear(currentDate);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    try {
        // Find all DiningFee records that need to be updated
        const diningFeeRecords = await DiningFee.find();

        // Update each record
        var x;
        const mon = currentDate.getMonth();
        if( mon == 0){
            x = 11;
        }
        else x = x - 1;
        var yr = currentDate.getYear();
        for (const record of diningFeeRecords) {
            if (record.currentMonth === 0) {
                const lateFeeRecord = new LateFee({
                    id: record.id,
                    monthYear: x+' '+y,
                    amountToBePaid: calculateAmount() // Replace with actual calculation
                });
                await lateFeeRecord.save();
            }
            
            record.currentMonth = record.nextMonth;
            record.nextMonth = 0;
            await record.save();
        }

        console.log('DiningFee records swapped and LateFee records updated successfully');
    } catch (error) {
        console.error('Error swapping DiningFee records:', error);
    }
});
function getPrevMonthYear(date) {
    const prevDate = new Date(date);
    prevDate.setMonth(date.getMonth() - 1);
    const month = prevDate.toLocaleString('default', { month: 'long' });
    const year = prevDate.getFullYear();
    return `${month} ${year}`;
}
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Front_Page/index.html'));
});

function calculateAmount() {
    // Replace with your actual calculation logic
    return 1200; // Example fixed amount
}

/***Manager***/
// Route to handle form submission
app.post('/submit-meal-count', async (req, res) => {
    // Extract data from request body
    console.log('Received form submission:', req.body);
    const { staff, extra } = req.body;

    // Calculate total
    const regular = 405; // Example regular meal count
    const staffCount = parseInt(staff) || 0;
    const extraCount = parseInt(extra) || 0;
    const total = regular + staffCount + extraCount;

    // Create a new instance of MealCount model
    const mealCount = new MealCount({
        regular: regular,
        staff: staffCount,
        extra: extraCount,
        total: total,
        date: new Date()
    });

    try {
        // Save the mealCount document to MongoDB
        const savedMealCount = await mealCount.save();
        console.log('Meal count saved:', savedMealCount);
        res.send('Meal count saved successfully!');
    } catch (err) {
        console.error('Error saving meal count:', err);
        res.status(500).send('Error saving meal count');
    }
});
app.post('/submit-another-meal-count', async (req, res) => {
    // Extract data from request body
    console.log('Received form submission:', req.body);
    const { staff, extra } = req.body;

    // Calculate total
    const regular = 405; // Example regular meal count
    const staffCount = parseInt(staff) || 0;
    const extraCount = parseInt(extra) || 0;
    const total = regular + staffCount + extraCount;

    // Create a new instance of MealCount model
    const anotherMealCount = new AnotherMealCount({
        regular: regular,
        staff: staffCount,
        extra: extraCount,
        total: total,
        date: new Date()
    });

    try {
        // Save the mealCount document to MongoDB
        const savedAnotherMealCount = await anotherMealCount.save();
        console.log('Meal count saved:', savedAnotherMealCount);
        res.send('Meal count saved successfully!');
    } catch (err) {
        console.error('Error saving meal count:', err);
        res.status(500).send('Error saving meal count');
    }
});
// Route to fetch meal counts
app.get('/meal-counts', async (req, res) => {
    try {
        const mealCounts = await MealCount.find().lean(); // Ensure to use .lean() for plain JavaScript objects
        console.log(mealCounts);
        res.json(mealCounts);
    } catch (error) {
        console.error('Error fetching meal counts:', error);
        res.status(500).json({ error: 'Failed to fetch meal counts' });
    }
});
// Route to fetch meal counts
app.get('/another-meal-counts', async (req, res) => {
    try {
        const anotherMealCounts = await AnotherMealCount.find().lean(); // Ensure to use .lean() for plain JavaScript objects
        res.json(anotherMealCounts);
    } catch (error) {
        console.error('Error fetching meal counts:', error);
        res.status(500).json({ error: 'Failed to fetch meal counts' });
    }
});

   
/* my work */
app.get('/upcoming-feast', async (req, res) => {
    try {
        // Find the upcoming feast with a date greater than or equal to today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log('Today\'s date:', today);

        // Find the upcoming feast with a date greater than or equal to today
        const upcomingFeast = await Feast.find({ date: { $gte: today } });

        console.log('Upcoming feast:', upcomingFeast);

        if (!upcomingFeast) {
            return res.status(404).json({ message: 'No upcoming feast found' });
        }

        res.status(200).json(upcomingFeast);
    } catch (error) {
        console.error('Error fetching upcoming feast:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/get-todays-lunch-meals', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the start of the day

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Set to the start of the next day
        tomorrow.setHours(0, 0, 0, 0);

        // Find lunch meals for today
        const lunches = await Lunch.find({ date: { $gte: today, $lt: tomorrow } });
        const lunchItems = lunches.flatMap(lunch => lunch.meal);

        res.status(200).json(lunchItems);
    } catch (error) {
        console.error("Error fetching today's lunch meals:", error.message);
        res.status(500).send(`Failed to fetch today's lunch meals: ${error.message}`);
    }
});
/* my work */
app.post('/submit-set-menu', async (req, res) => {
    try {
        const { lunch, dinner } = req.body;

        if (lunch) {
            const lunchItems = lunch.split(',').map(item => item.trim());
            console.log('Submitting lunch items:', lunchItems);
            await Lunchh.insertMany(lunchItems.map(meal => ({ meal, date: new Date() })));
        }

        if (dinner) {
            const dinnerItems = dinner.split(',').map(item => item.trim());
            console.log('Submitting dinner items:', dinnerItems);
            await Dinnerr.insertMany(dinnerItems.map(meal => ({ meal, date: new Date() })));
        }

        res.status(200).send('Set menu submitted successfully!');
    } catch (error) {
        console.error('Error submitting set menu:', error.message);
        res.status(500).send(`Failed to submit set menu: ${error.message}`);
    }
});


app.get('/get-todays-menu', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log('Fetching menu for date:', today);

        // Find the most recent lunch entry
        const recentLunch = await Lunchh.findOne({ date: { $gte: today } }).sort({ date: -1 });
        // Find the most recent dinner entry
        const recentDinner = await Dinnerr.findOne({ date: { $gte: today } }).sort({ date: -1 });

        console.log('Recent lunch found:', recentLunch);
        console.log('Recent dinner found:', recentDinner);

        res.json({
            lunch: recentLunch ? recentLunch.meal : '',
            dinner: recentDinner ? recentDinner.meal : ''
        });
    } catch (error) {
        console.error('Error fetching menu:', error.message);
        res.status(500).send(`Failed to fetch menu: ${error.message}`);
    }
});
// Route to fetch lunch data
app.get('/get-lunch-meals', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lunches = await Lunchh.find({date: { $gte: today}});
        const lunchItems = lunches.flatMap(lunch => lunch.meal);
        res.status(200).json(lunchItems);
    } catch (error) {
        console.error('Error fetching lunch meals:', error.message);
        res.status(500).send(`Failed to fetch lunch meals: ${error.message}`);
    }
});
// Route to fetch dinner data
app.get('/get-dinner-meals', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dinners = await Dinnerr.find({date: { $gte: today }});
        const dinnerItems = dinners.flatMap(dinner => dinner.meal);
        res.status(200).json(dinnerItems);
    } catch (error) {
        console.error('Error fetching dinner meals:', error.message);
        res.status(500).send(`Failed to fetch dinner meals: ${error.message}`);
    }
});
/***Manager***/

/*** admin ***/
app.post('/students', async (req, res) => {
    const newStudent = new Users(req.body);
    console.log(newStudent);
    try {
        const newStudent = new Users(req.body);
        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Failed to add student' });
    }
    
});
app.get('/students', async (req, res) => {
    try {
        const student = await Users.find().lean();
        res.json(student);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.delete('/students', async (req, res) => {
    try {
        await Users.deleteMany({});
        res.status(200).json({ message: 'All students deleted successfully' });
    } catch (error) {
        console.error('Error deleting all students:', error);
        res.status(500).json({ error: 'Failed to delete all students' });
    }
});
app.put('/students/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedStudent = await Users.findOneAndUpdate({ id: id }, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Failed to update student' });
    }
});
app.delete('/students/:id', async (req, res) => {
    const id  = req.params.id;
    
    try {
        const deletedStudent = await Users.findOneAndDelete({ id: id });
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});
app.put('/students/updateType/:id', async (req, res) => {
    const id = req.params.id;
    const { type } = req.body;
    try {
        const updatedStudent = await Users.findOneAndUpdate(
            { id: id },
            { type: type },
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student type updated successfully', student: updatedStudent });
    } catch (error) {
        console.error('Error updating student type:', error);
        res.status(500).json({ error: 'Failed to update student type' });
    }
});


/*** admin ***/

app.post("/sign_up", async (req, res) => {
    const { name, id, roomno, contno, password } = req.body;
     
    const user = new Users({
        name,
        id,
        roomno,
        contno,
        password
    });
    try {
        await user.save();

        // Create initial dining fee record for the user
        const diningFeeRecord = new DiningFee({
            id: id,
            currentMonth: 0,
            nextMonth: 0
        });
        await diningFeeRecord.save();

        // Create an initial lunch record for the user
        let lunchRecord = new Lunch({ id: id });
        await lunchRecord.save();
        let dinnerRecord = new Dinner({ id: id });
        await dinnerRecord.save();

        res.redirect(`/practice.html?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving data");
    }
});

app.post("/login", async (req, res) => {
    const { name, password } = req.body;
    try {
        const user1 = await Admins.findOne({ name: name, password: password });
        const user = await Users.findOne({ name: name, password: password });
        if (user1) {
            const redirectUrl = `/Admin/admin.html?name=${encodeURIComponent(user1.name)}&success=true`;
            return res.redirect(redirectUrl);
        }
        else if (user) {
            if (!user.type) {
                const redirectUrl = `/Meal_Calender/practice.html?name=${encodeURIComponent(user.name)}&id=${encodeURIComponent(user.id)}&success=true`;
                return res.redirect(redirectUrl);
            } else { 
                const redirectUrl = `/Front_Page/index.html?name=${encodeURIComponent(user.name)}&id=${encodeURIComponent(user.id)}&role-selection=true`;
                return res.redirect(redirectUrl);
            }
        }
        
        else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
});

// Fetch lunch record for the user
app.get("/get_lunch/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const lunchRecord = await Lunch.findOne({ id: id });
        if (lunchRecord) {
            res.status(200).json(lunchRecord);
        } else {
            res.status(404).send("Lunch record not found");
        }
    } catch (error) {
        console.error("Error fetching lunch record:", error);
        res.status(500).send("Error fetching lunch record");
    }
});

app.post("/update_lunch", async (req, res) => {
    const { id, day } = req.body;

    try {
        console.log(`Received request to update meal for id: ${id}, day: ${day}`);

        let lunchRecord = await Lunch.findOne({ id: id });
        let dinnerRecord = await Dinner.findOne({ id: id });

        if (!lunchRecord) {
            // If no record exists, create a new one
            console.log(`No meal record found for id: ${id}. Creating a new one.`);
            lunchRecord = new Lunch({ id: id });
            dinnerRecord = new Dinner({ id: id });
        }

        lunchRecord.days[day] = true;
        dinnerRecord.days[day] = true;
        await lunchRecord.save();
        await dinnerRecord.save();

        console.log(`Meal record updated successfully for id: ${id}, day: ${day}`);
        res.status(200).send("Meal record updated successfully");
    } catch (error) {
        console.error("Error updating meal record:", error);
        res.status(500).send("Error updating meal record");
    }
});
app.get("/get_dining_fee/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const diningFeeRecord = await DiningFee.findOne({ id: id });
        if (diningFeeRecord) {
            res.status(200).json(diningFeeRecord);
        } else {
            res.status(404).send("Dining fee record not found");
        }
    } catch (error) {
        console.error("Error fetching dining fee record:", error);
        res.status(500).send("Error fetching dining fee record");
    }
});
// Fetch managers where type is true
app.get("/managers", async (req, res) => {
    try {
        const managers = await Users.find({ type: true });
        console.log(managers);
        res.status(200).json(managers);
    } catch (error) {
        console.error("Error fetching managers:", error);
        res.status(500).send("Error fetching managers");
    }
});
app.get('/get_late_fee_records/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Query MongoDB to find all late fee records for the given user ID
        const lateFees = await LateFee.find({ id: id });

        if (!lateFees || lateFees.length === 0) {
            return res.status(404).json({ error: 'Late fee records not found' });
        }
        // Send the fetched data to the client
        res.json(lateFees);
    } catch (error) {
        console.error('Error fetching late fee records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Server-side endpoint to delete late fee records
app.post('/delete_late_fee_records', async (req, res) => {
    const idsToDelete = req.body.ids; // Assuming you send the IDs of selected rows in the request body

    try {
        // Delete records based on MongoDB _id
        const deleteResult = await LateFee.deleteMany({ _id: { $in: idsToDelete } });
        console.log('Deleted late fee records:', deleteResult);

        res.status(200).json({ message: 'Late fee records deleted successfully' });
    } catch (error) {
        console.error('Error deleting late fee records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/pay_dining_fee', async (req, res) => {
    const { id, monthType, amount, transactionId } = req.body;

    console.log(`Payment received for user ${id}, month ${monthType}, amount ${amount}, transaction ID ${transactionId}`);

    try {
        let diningFeeRecord = await DiningFee.findOne({ id });

        if (!diningFeeRecord) {
            diningFeeRecord = new DiningFee({ id });
        }

        if (monthType === 'current') {
            diningFeeRecord.currentMonth = amount; // Update currentMonth with amount
        } else if (monthType === 'next') {
            diningFeeRecord.nextMonth = amount; // Update nextMonth with amount
        }

        await diningFeeRecord.save();

        console.log(`Payment received for user ${id}, month ${monthType}, amount ${amount}, transaction ID ${transactionId}`);

        res.sendStatus(200); // Respond with success status
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('Error processing payment');
    }
});
//manager_homepage
app.post('/submit-meal-count', async (req, res) => {
    // Extract data from request body
    console.log('Received form submission:', req.body);
    const { staff, extra } = req.body;

    // Calculate total
    const regular = 405; // Example regular meal count
    const staffCount = parseInt(staff) || 0;
    const extraCount = parseInt(extra) || 0;
    const total = regular + staffCount + extraCount;

    // Create a new instance of MealCount model
    const mealCount = new MealCount({
        regular: regular,
        staff: staffCount,
        extra: extraCount,
        total: total,
        date: new Date()
    });

    try {
        // Save the mealCount document to MongoDB
        const savedMealCount = await mealCount.save();
        console.log('Meal count saved:', savedMealCount);
        res.send('Meal count saved successfully!');
    } catch (err) {
        console.error('Error saving meal count:', err);
        res.status(500).send('Error saving meal count');
    }
});

app.listen(port, () => {
    console.log("server started");
});

