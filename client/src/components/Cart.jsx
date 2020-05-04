import { connect } from 'react-redux';
import React from 'react';
import { removeFromCart } from "../actions/cartActions";
import CheckoutForm from "./CheckoutForm";
import Listing from "./Listing";

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = { totalPrice: 0};
    }

    componentDidMount() {
        let price = 0;
        this.props.items.forEach((listing) => price = price + parseFloat(listing.price));
        this.setState({ totalPrice: price.toFixed(2) });
    }

    removeFromCart = (listing) => {
        this.setState((prevState) => ( { totalPrice: (prevState.totalPrice - listing.price).toFixed(2) }));
        this.props.removeFromCart(listing.listing_id);
    };

    render() {
        const items = this.props.items;
        return (
            <div className="container p-0">
                {items.length === 0 ? <h2 className="text-center mt-4 w-100">Cart is empty</h2> :
                    <div className="row">
                        <div className="col-6 p-0">
                            {items.map((listing) => {
                                return <Listing listing={listing} key={listing.listing_id} handleClick={this.removeFromCart} showButton={true} buttonText="Remove" />
                            })}
                        </div>

                        <div className="col-6 p-0">
                            <CheckoutForm total={this.state.totalPrice} items={items} id={this.props.id}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        items: state.items
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeFromCart: (listing_id) => { dispatch(removeFromCart(listing_id)) }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
