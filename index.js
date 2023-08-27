require('dotenv').config();
const express = require("express");
const cors = require("cors")

const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('working')
})

app.post('/pay', async (req, res)=> {
    try {
        // const {name} = req.body;
        // if (!name) return res.status(400).json({message: 'Please enter a name'})
        
        const {amount} = Number(req.body);
        // if (!amount) return res.status(400).json({message: 'Amount invalid'})
        console.log("amount: ", amount)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(25 * 100),
            currency: 'INR',
            automatic_payment_methods: {enabled: true,},
        })
        const clientSecret = paymentIntent.client_secret 
        res.json({message: 'payment initiated', clientSecret})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'internal server error'})
    }
})

app.listen(process.env.PORT || port, ()=> {console.log(`Server running on Port : ${port}`)})
