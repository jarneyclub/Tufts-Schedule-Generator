const mongoose = require('mongoose');
const Response = mongoose.model('Response');

exports.saveCustomerResponse = async (req, res) => {
    try {
        let {name, email, message} = req.body;
    
        let newResponse = new Response({
            name: name,
            email: email,
            message: message,
            date: Date.now()   
        });
        
        newResponse.save();
    
        res.status(200).send();
    }
    catch (e) {
        errorHandler(e, "saveCustomerResponse");
    }
}

const errorHandler = (e, functionName) => {
    if (e.message !== undefined) {
        if (e.message.indexOf("validation failed") > -1) {
            // console.log(e.errors['plan_name']);
            /* error is mongoose validation error */
            throw { id: "201", status: "400", title: "Customer Response Error (" + functionName + ")" , detail: e.message };
        }
        else {
            throw { id: "000", status: "500", title: "Customer Response Error (" + functionName + ")", detail: e.message };
        }
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail };
        }
        else {
            throw { id: "000", status: "500", title: "Customer Response Error (" + functionName + ")", detail: e.message };
        }
    }
}
