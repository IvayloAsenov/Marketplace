import React from 'react';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmedPassword: "",
            error: ""
        };
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState(prevState => {
            const newState = { ...prevState };
            newState[name] = value;
            return newState;
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.confirmedPassword) {
            this.setState({ error: "Passwords do not match! "});
        } else {
            this.setState( { error: "" });
            this.props.handle(e, this.state);
        }
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-sm-10 mx-auto text-center form p-4">
                        <div className="card">
                            <article className="card-body">
                                <h4 className="card-title mb-4 mt-1">Sign Up</h4>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label>Your username</label>
                                        <input name="username" className="form-control" placeholder="Username" type="username" onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Your password</label>
                                        <input name="password" className="form-control" placeholder="******" type="password" onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirm your password</label>
                                        <input name="confirmedPassword" className="form-control" placeholder="******" type="password" onChange={this.handleChange} />
                                    </div>

                                    <div className="form-group mt-3">
                                        <button type="submit" className="btn btn-primary btn-block btn-dark">Sign Up</button>
                                    </div>
                                    {this.state.error.length !== 0 &&
                                        <div className="alert alert-danger" role="alert">
                                            {this.state.error}
                                        </div>
                                    }
                                </form>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
