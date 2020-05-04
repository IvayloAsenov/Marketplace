import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";

class CreateListingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 1,
            price: 0,
            photo: undefined,
            title: '',
            category: undefined,
            description: '',
            err: ''
        };
    };

    handleChange = (e) => {
        const re = /^[0-9]+\.?[0-9]{0,2}$/;

        const name = e.target.name;
        let value = e.target.value;

        if (name === 'price' && (value !== '' && !re.test(e.target.value))) {
            return;
        }
        if (name === 'amount' && isNaN(e.target.value)){
            return;
        }

        this.setState(prevState => {
            const newState = { ...prevState };
            newState[name] = value;
            return newState;
        });
    };

    handleImageChange = (e) => {
        this.setState({
            photo: e.target.files[0]
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.category === 'DEFAULT' || this.state.category === undefined) {
            this.setState( {err: 'Please choose a category.'} );
            return;
        }

        this.setState({err: ''});

        let form_data = new FormData();
        form_data.append('photo', this.state.photo, this.state.photo.name);
        form_data.append('amount', this.state.amount);
        form_data.append('price', this.state.price);
        form_data.append('name', this.state.title);
        form_data.append('categories', this.state.category);
        form_data.append('description', this.state.description);
        form_data.append('seller_id', this.props.id);

        fetch('http://localhost:8000/core/listings/', {
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
            this.props.onHide();
            return res.json()
        })
            .then(json => {
                console.log(json);
            }).catch(err => alert("Something went wrong!"));
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create a listing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Woohoo, add your ad to the marketplace!</p>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Title</label>
                                <input name="title" type="text" className="form-control" placeholder="Title"
                                       onChange={this.handleChange} required />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Price</label>
                                <input name="price" type="text" className="form-control" placeholder="Price"
                                       onChange={this.handleChange} value={this.state.price} required />
                            </div>

                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Amount</label>
                                <input name="amount" type="text" className="form-control" placeholder="Amount"
                                       onChange={this.handleChange} value={this.state.amount} required />
                            </div>
                            
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputAddress">Description</label>
                            <textarea name="description" className="form-control" placeholder="Describe your amazing piece of clothing!"
                                      rows="4" cols="50" onChange={this.handleChange} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <label htmlFor="inputCity">Image</label>
                                <input name="photo" type="file" className="form-control" accept="image/*"
                                       onChange={this.handleImageChange} required />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputState">Category</label>
                                <select name="category" defaultValue="DEFAULT" className="form-control" onChange={this.handleChange} required >
                                    <option value="DEFAULT">Choose...</option>
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
                        <button name="submit" className="btn btn-primary btn-block btn-dark">
                            Submit
                        </button>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <div className="w-100">
                        {this.state.err !== '' && <div className="alert alert-danger" role="alert">
                            { this.state.err }
                        </div> }
                        <span className="float-right">
                            <Button variant="secondary" onClick={this.props.onHide}>
                                Close
                            </Button>
                        </span>
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default CreateListingModal;