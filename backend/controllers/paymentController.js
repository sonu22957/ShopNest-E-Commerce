// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// dotenv.config();

// const createdOrder = async (req, res) => {
//     try{
//         const instance = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET
//         });
//         const options={
//             amount: req.body.amount*100,
//             currency: "INR",
//             receipt: "order_rcptid_11"
//         };
//         const order = await instance.orders.create(options);
//         res.status(200).json({
//             success: true,
//             order
//         });
//     }
//     catch(error){
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     };
// }

// const verifyPayment = ansyc (req, res) => {
//     try {
//         const secret = process.env.RAZORPAY_KEY_SECRET;
//         const shasum = crypto.createHmac("sha256", secret);
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");
//         if (digest === req.headers["x-razorpay-signature"]) {
//             res.status(200).json({
//                 success: true,
//                 message: "Payment verified successfully"
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 message: "Payment verification failed"
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
    


const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

// Create Razorpay Order
const createOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Number(req.body.amount) * 100,
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Verify Razorpay Payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;

        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature === razorpay_signature) {
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        }

        return res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createOrder,
    verifyPayment,
};