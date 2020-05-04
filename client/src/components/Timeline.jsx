import { addToCart } from "../actions/cartActions";
import { connect } from 'react-redux';
import React from 'react';

import '../styles/Timeline.css';
import CreateListingModal from "./CreateListingModal";
import Listing from "./Listing";

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            listings: [],
            filtered_listings: [],
            filters: {
                latestFirst: true,
                search: '',
                category: 'all',
            }
        };
    };

    // Get listings
    componentDidMount() {
        console.log(this.props);
       this.getListings();
    };

    applyFilters() {
        const filters = this.state.filters;
        let filtered_listings = this.state.listings;

        filtered_listings = filtered_listings.filter((listing) => listing.name.includes(filters.search) && listing.amount > 0);

        filtered_listings.sort((l1, l2) => {
            return new Date(l1.listed_on).getTime() - new Date(l2.listed_on).getTime()
        });

        if (filters.category.toLowerCase() !== 'all') {
            filtered_listings = filtered_listings.filter((listing) => listing.categories.includes((filters.category)));
        }

        if (filters.latestFirst) filtered_listings.reverse();

        this.setState({ filtered_listings })
    }

    filterChange = (e) => {
        if (e.target.value === 'oldest') {
            this.setState(prevState => ({ filters: { ...prevState.filters, latestFirst: false } }), () => this.applyFilters());
        }
        else {
            this.setState(prevState => ({ filters: {...prevState.filters, latestFirst: true }}), () => this.applyFilters());
        }
    };

    onSearchChange = (e) => {
        const value = e.target.value;
        this.setState(prevState => ({ filters: { ...prevState.filters, search: value }}), () => this.applyFilters());
    };

    onCategoryChange = (e) => {
        const value = e.target.value;
        this.setState(prevState => ({filters: {...prevState.filters, category: value}}), () => this.applyFilters());
    };

    getListings = () => {
        fetch('http://localhost:8000/core/listings/', {
            method: 'GET',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
        }).then(res => {
            if(res.status >= 400) {
                throw new Error("");
            }
            return res.json()
        })
            .then(json => {
                this.setState({listings: json});
                this.applyFilters();
            }).catch(err => alert("Something went wrong, can't get Listings!"));
    };

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
        this.getListings();
    };

    addToCart = (listing) => {
        this.props.addToCart(listing);

        const serializedState = localStorage.getItem('state');

        if (JSON.parse(serializedState).total === this.props.total) {
            alert('Already added to cart.');
        } else {
            alert('Item added to cart');
        }
    };

    render() {
        console.log(this.state.filtered_listings);
        return (
            <div>
                <section className="jumbotron text-center mb-0 bg-white pt-3">
                    <div className="container">
                        <div className="d-flex justify-content-end">
                            <button type="button" onClick={this.showModal} className="btn btn-outline-success">Create Listing</button>
                        </div>
                        <div className="d-flex">
                            <div className="flex-grow-2 mr-4 mb-2">
                                <label className="float-left">Name</label>
                                <input className="form-control m-auto" type="text" placeholder="Search..." value={this.state.filters.search} onChange={this.onSearchChange} />
                            </div>
                            <div className="flex-grow-1">
                                <label className="float-left">Category</label>
                                <select name="category" defaultValue="DEFAULT" className="form-control" onChange={this.onCategoryChange} required >
                                    <option value="All">All</option>
                                    <option value="Hats">Hats</option>
                                    <option value="Shirts">Shirts</option>
                                    <option value="Sweatshirts">Sweat Shirts</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Pants">Pants</option>
                                    <option value="Shorts">Shorts</option>
                                    <option value="Shoes">Shoes</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="float-left">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="exampleRadios"
                                       id="exampleRadios1" value="latest" checked={this.state.filters.latestFirst} onChange={this.filterChange} />
                                    <label className="form-check-label" htmlFor="exampleRadios1">
                                        Sort by latest first
                                    </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="exampleRadios"
                                       id="exampleRadios2" value="oldest" checked={!this.state.filters.latestFirst} onChange={this.filterChange} />
                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                        Sort by oldest first
                                    </label>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="container-fluid h-100 p-0 gray">
                    <div className="row m-0">
                        <div className="col-md-12 ">

                            {this.state.filtered_listings.map((listing) => {
                                return <Listing key={listing.listing_id} listing={listing} handleClick={this.addToCart} showButton buttonText="Add to cart"/>
                            })}
                        </div>
                    </div>
                </div>

                <CreateListingModal
                    show={ this.state.show }
                    onHide={ () => this.hideModal() }
                    id={this.props.id}
                />
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        total: state.total
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addToCart: (listing) => { dispatch(addToCart(listing)) }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
