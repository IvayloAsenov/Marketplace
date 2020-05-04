import React from 'react';
import Ordering from "./Ordering";
import "../styles/Ordering.css";


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '', orders: [] , mylistings: [], chatroom_id: undefined};
    }

    getUsername(seller_id) {
        fetch(`http://localhost:8000/core/users?id=${seller_id}`, {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {
            this.setState({ username: json.username });
        });
    }

    getOrders(seller_id) {
        fetch(`http://localhost:8000/core/orders?id=${seller_id}`, {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {
            this.setState({ orders: json.results });
            console.log(json.results)
        }).catch((e) => console.log(e));
    }

    getMyListings(seller_id) {
        fetch(`http://127.0.0.1:8000/core/getmylisting/?seller_id=${seller_id}`, {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {
            this.setState({ mylistings: json.results });
        }).catch((e) => console.log(e));
    }

    deleteMyListings = (listing) => {
        fetch(`http://127.0.0.1:8000/core/deletemylisting/?seller_id=${this.props.id}&listing_id=${listing.listing_id}`, {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {
            this.setState({ mylistings: json.results });
        }).catch((e) => console.log(e));
    };

    deleteMyOrders = (order) => {
        console.log(order)
        fetch(`http://127.0.0.1:8000/core/deletemyorders/?id=${this.props.id}&order_id=${order.order_id}`, {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json();
        }).then(json => {
            this.setState({ orders: json.results });
        }).catch((e) => console.log(e));
    };

    componentWillMount() {
        const seller_id = this.props.match.params.name;
        this.getUsername(seller_id);
        this.getOrders(seller_id);
        this.getMyListings(seller_id);
        // this.showMyOrders(seller_id);
        this.setState({ chatroom_id: seller_id})
    }

    render() {
        console.log(this.props);
        let show = ((this.props.id)==(this.props.match.params.name));
        return (
            <div style={{backgroundColor:"#E8E9EB"}}>
                <h1 className="fixedContainer">{this.state.username}'s Profile</h1>
                <li className="nav-item">
                    <a className="fixedContainer" href={`/chat/${this.state.chatroom_id}`}>Chat with {this.state.username}</a>
                </li>
                {(show) && <div style={{ minHeight:700}}>
                    <div>
                        <h3 className="fixedContainer">Order History</h3>
                    </div>

                    <div className="container-fluid h-100 p-0 gray">
                        <div className="row m-0">
                            <div className="col-md-12 ">
                                {this.state.orders.map((order,i) => {
                                    return <Ordering key={i} order={order} photopath={order.listing__photo}  list_name={order.listing__name} description={order.listing__description} price={order.listing__price} handleClick={this.deleteMyOrders} showButton={show} buttonText="Delete" />
                                })}
                            </div>
                        </div>
                    </div>
                </div>}

                <div style={{backgroundColor:"#E8E9EB",minHeight:700}}>
                    <div className="fixedContainer">
                        <h3>All Listings</h3>
                    </div>
                    <div className="container-fluid h-100 p-0 gray">
                        <div className="row m-0">
                            <div className="col-md-12 ">
                                {this.state.mylistings.map((listing,i) => {
                                    return <Ordering key={i} id={this.props.id} listing={listing} listing_id={listing.listing_id} photopath={listing.photo} list_name={listing.name} description={listing.description} price={listing.price} handleClick={this.deleteMyListings} showButton={show} buttonText="Delete Listing"/>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserProfile;

