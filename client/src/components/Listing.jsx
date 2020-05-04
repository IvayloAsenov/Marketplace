import React from 'react';
import '../styles/Listing.css';

class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            inCart:false,
        }
    }

    isInCart=()=>{
        this.setState({inCart:true})
    }
    notInCart=()=>{
        this.setState({inCart:false})
    }

    render() {
        const img = `http://localhost:8000${this.props.listing.photo}`;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 mt-2">
                        <div className="card rounded">
                            <div className="card-horizontal">
                                <div className="bg-color-img">
                                    <div className="img-square-wrapper max-height item ml-2 mr-2 bar">
                                         {(this.props.listing.amount>0)&&<p className="text-above-instock ">In Stock: {this.props.listing.amount}</p> }
                                         {(this.props.listing.amount===0)&&<p className="text-above-outstock ">Out of Stock</p> }

                                        <img className="" src={img} alt="Card image cap" />
                                    </div>
                                </div>
                                <div className="vl" />
                            
                                <div className="card-body card-container pb-0">
                                    <h5 className="card-title">{this.props.listing.name}</h5>
                                    <p className="card-text">{this.props.listing.description}</p>
                                    <div className="button-container">
                                        <div className="d-flex flex-column align-items-center justify-content-end">
                                            <p className="price mb-2">{"$" + parseFloat(this.props.listing.price).toFixed(2)}</p>
                                        </div>
                                        <div className="d-flex flex-column">
                                            {this.props.showButton && <a href="#" className="btn btn-primary display-block" onClick={() => this.props.handleClick(this.props.listing)}>{this.props.buttonText}</a>}
                                            <a href={`/users/${this.props.listing.seller_id}`} className="display-block">See sellers profile</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Listing;
