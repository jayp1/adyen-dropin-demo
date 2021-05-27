import React, { useState } from 'react';
import './Checkout.css';
import initDropIn from './initDropIn';


const Checkout = (props) => {

    const [form, setForm] = useState({ fName: "", lName: "",email:"", country: "USD", payment_amount: 0 });

    const handleChange = (e) => {
        const prevForm = { ...form };
        prevForm[e.target.id] = e.target.value;
        setForm(prevForm);
    }

    const handleSubmission = (e) => {
        e.preventDefault();
        initDropIn(form);
    }

    return (

        <main>

            <div className="heading"><h2>Adyen Dropin Demo</h2><p className="sub-heading">Enter and submit an amount to initialise a dropin payment process</p></div>
            <section id="checkout">
                <form onSubmit={handleSubmission}>

                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input type="text" onChange={handleChange} className="form-control" id="fName" placeholder="First name" value={form.fName} />

                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input type="text" onChange={handleChange} className="form-control" id="lName" placeholder="Surname" value={form.lName} />

                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" required onChange={handleChange} className="form-control" id="email" placeholder="joe@example.com" value={form.email} />


                    <label htmlFor="country" className="form-label">Country</label>
                    <div className="country-amount">
                        <select className="form-select" onChange={handleChange} value={form.country} id="country" required>
                            <option value="USD">United States</option>
                            <option value="EUR">Netherlands</option>
                        </select>

                        <div id="pay-group">
                            <span className="input-group-text">{form.country === "EUR" ? '€' : '$'}</span>
                            <input type="number" min='0' required onChange={handleChange} id="payment_amount" className="form-control" aria-label="Amount (to the nearest number)" />
                            <span className="input-group-text">.00</span>
                        </div>

                    </div>


                    <hr className="my-4" />
                    <button type="submit">Continue to checkout</button>
                </form>
                <div id="dropin-container"></div>
            </section>

        </main>

    );
}
export default Checkout;