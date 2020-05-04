import React from 'react';
import '../styles/Listing.css';
import UpdateListingModal from "./UpdateListingModal";
 
class Ordering extends React.Component {
    constructor(props) {
        super(props);
        this.state= { show: false};
    }
    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    render() {
        let isListing = !(typeof this.props.listing === "undefined");
        let isOrdering = !(typeof this.props.order === "undefined");

        const check = this.props.photopath.includes("/media/listing/");
        let img = `http://localhost:8000${this.props.photopath}`;
        if(!check){
            img = `http://localhost:8000/media/listing/${this.props.photopath}`;
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-2">
                        <div className="card rounded">
                            <div className="card-horizontal">
                                <div className="bg-color-img">
                                    <div className="img-square-wrapper max-height item ml-2 mr-2 bar">
                                        {(isOrdering)&&<p className="text-above-instock ">Purchased: {this.props.order.amount}</p> }
                                        {(isListing&&this.props.listing.amount>0) && <p className="text-above-instock "> In Stock: {this.props.listing.amount}</p> }
                                        {(isListing&&this.props.listing.amount===0)&&<p className="text-above-outstock ">Out of Stock</p> }
        
                                        <img className="" src={img} alt="Card image cap" />
                                    </div>
                                </div>
                                <div className="vl" />
                                <div className="card-body card-container pb-0">
                                    <h5 className="card-title">{this.props.list_name}</h5> 
                                    <p className="card-text">{this.props.description}</p> 
                                    <div className="button-container">
                                        <div className="d-flex flex-column align-items-center justify-content-end">
                                            <p className="price mb-2">{"$" + parseFloat(this.props.price).toFixed(2)}</p>  
                                        </div>
                                        <div className="d-flex flex-column">
                                            {(this.props.showButton && !isOrdering) &&<a href="#" className="btn btn-primary display-block" onClick={() => this.props.handleClick(this.props.listing)}>{this.props.buttonText}</a>}
                                            {(this.props.showButton && !isListing)  && <a href="#" className="btn btn-primary display-block" onClick={() => this.props.handleClick(this.props.order)}>{this.props.buttonText}</a>}
                                            {(this.props.showButton && !isOrdering ) && <div className="d-flex justify-content-end">
                                                 <button type="button" onClick={this.showModal} className="btn btn-outline-success">Update Listing</button>
                                                 </div>}
                                        </div>
                                    </div>
                                    {isListing &&
                                    <UpdateListingModal 
                                    show={ this.state.show } 
                                    id = { this.props.id } 
                                    listingid={this.props.listing_id} 
                                    photo={this.props.photopath} 
                                    title={this.props.list_name} 
                                    description={this.props.description} 
                                    price={this.props.price} 
                                    onHide={ () => this.hideModal() }  
                                    />}
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default Ordering;
