import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

export default function CheckoutForm(props) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(props);

        const payload = {
            price: props.total,
            items: props.items,
        };

        fetch('http://localhost:8000/core/payment/', {
            method: 'POST',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {
            commitPayment(json).then((res) => {
                if (res) {
                    localStorage.removeItem('state');
                    createOrder();
                    alert("Payment succeded!");
                } else {
                    alert("Payment failed!");
                }
            })
        }).catch(err => alert("Something went wrong!"));
    };

    const commitPayment = async ({clientSecret}) => {
        if (!stripe || !elements) {
            return false;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Test',
                },
            }
        });

        if (result.error) {
            return false;
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                return true;
            }
        }
    };

    // TODO: instead of calling N times endpoint, create an endpoint that takes a list
    const createOrder = async () => {
        props.items.forEach((item) => {
            let form_data = new FormData();
            form_data.append('listing', item.listing_id);
            form_data.append('buyer', props.id);

            fetch('http://localhost:8000/core/orders/', {
                method: 'POST',
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                },
                body: form_data
            }).then(res => {
                if(res.status >= 400) {
                    console.log(res);
                    throw new Error("");
                }
                return res.json()
            })
                .then(json => {
                    console.log(json);
                    window.location.href = "/"
                }).catch(err => alert("Something went wrong!"));
        })
    };

    return (
        <div className="mt-5">
            <CardElement options={{
                style: {
                    base: {
                        fontSize: '32px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                },
            }} />
            <p className="price mb-2">{"$" + parseFloat(props.total).toFixed(2)}</p>
            <input type="text" style = {{ width : 585, height : 40, marginBottom : 10, marginTop : 10  }} id="name" placeholder="Address" required="" />
            <button onClick={handleSubmit} name="submit" type="button" className="btn btn-primary w-100" disabled={!stripe}>Confirm Order</button>
        </div>
    );
}
