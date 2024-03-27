const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors');
const cron = require('node-cron');
const Main = require('./schemas/Main');

const PORT = process.env.PORT || 3000;

const app = express();

function getRemainingDaysInCurrentMonth() {
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth(); // Get the current month (0-indexed)
    const currentYear = currentDate.getFullYear(); // Get the current year
    const currentDay = currentDate.getDate(); // Get the current day of the month

    // Create a new Date object for the next month
    // By setting the day to 0, we get the last day of the current month
    const lastDayOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);

    // Get the day component of the last day of the current month, which gives the number of days in the month
    const totalDaysInMonth = lastDayOfCurrentMonth.getDate();

    // Calculate the remaining days in the month
    const remainingDays = totalDaysInMonth - currentDay;

    return remainingDays;
}


function Stack() {
    let Node = function(data) {
        this.data = data;
        this.next = null;
    }

    this.head = null;
    this.length = 0;

    this.push = function(data) {
        let node = new Node(data);
        if (this.head !== null) {
            node.next = this.head;
        }
        this.head = node;
        this.length++;
    }

    this.pop = function(){
        let current = this.head;

        if(current) {
            let return_data = current.data;
            this.head = current.next;
            current.next = null; // Disconnect current node
            this.length--;
            return return_data;
        }

        return null;
    }

    this.top = function(){
        return this.head === null ? null : this.head.data;
    }

    this.isEmpty = function() {
        return this.head === null;
    }
}



let changes = new Stack();


let daysinmonth = getRemainingDaysInCurrentMonth(); 
let savingstarget = 2000;
let money = 5000;
let dl = (money - savingstarget)/daysinmonth;
let expenses = 0;
let dabp = 0;
let dab = dabp + dl;




main().catch(err => console.log(err))
async function main() {
    await mongoose.connect(process.env.DB_STRING);
    console.log("DB connected .. ")
}


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get('/', function (req,res,next) {
    res.json({
        message:"hello"
    })
}) 


app.post('/expense', function(req,res,next) {
    let predicted_dab = dab + dl;
    let change = {
        dab,
        expenses,
        predicted_dab,
        money
    }
    changes.push(change);
    let exp = parseInt(req.body.expense);
    console.log(exp)
    console.log(dl)
    expenses += exp;
    money -= exp;
    dab -= exp;



    console.log(dab)
    res.status(200).json({
        message:"Expense created Dab Will be updated at 00:00",
    })
})


app.get('/change', function(req,res,next) {
    let revert = changes.pop();
    dab = revert.dab
    money = revert.dab;
    expenses = revert.dab;
    res.status(200).json({
        revert
    })
})



app.get('/info' , function (req,res,next) {
    let predicted_dab = (dab) + dl;
    res.status(200).json(
        {
            dab:dab,
            dabp: dabp,
            dl: dl,
            money:money,
            savingstarget:savingstarget,
            expenses:expenses,
            predicted_dab: predicted_dab
        }
    )
})

cron.schedule('59 11 * * *' , async () => {
    const main = new Main({
        DAB: dab,
        DABP: dabp,
        expenses: expenses
    })
    await main.save();
    let tmp = dab;
    dab = dabp + dl;
    dabp = tmp;
    expenses = 0;
    

    console.log('cron job executed...')
    
}, {
    timezone: 'Asia/Kolkata'
})





app.listen(PORT, '0.0.0.0', () => {
    console.log("server running ..");
})


app.get('*', function (req,res,next) {
    res.status(404).send("404");
})