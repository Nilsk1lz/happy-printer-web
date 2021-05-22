import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

class Login extends Component {
  state = {
    email: "",
    password: "",
    terms: false,
    alert: "",
  };

  submitForm = () => {
    if (!this.state.email) {
      this.setState({ alert: "Please enter a valid email" });
      return;
    }

    if (!this.state.password) {
      this.setState({ alert: "Please enter a valid password" });
      return;
    }
    if (!this.state.terms) {
      this.setState({ alert: "Please accept the terms and conditions" });
      return;
    }

    Axios.post("/api/register", {
      email: this.state.email,
      password: this.state.password,
    })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <h3 className="mt-5">Register a new account</h3>
            <Form>
              <Form.Group controlId="formBasicEmail">
                {this.state.alert && (
                  <Alert variant={"danger"}>{this.state.alert}</Alert>
                )}
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={({ target }) => {
                    this.setState({ email: target.value, alert: "" });
                  }}
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={({ target }) => {
                    this.setState({ password: target.value, alert: "" });
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="I agree to the terms and conditions"
                  value={this.state.terms}
                  onChange={() => {
                    this.setState({ terms: !this.state.terms });
                  }}
                />
              </Form.Group>
              <Button
                className="button-login"
                variant="primary"
                type="submit"
                onClick={this.submitForm}
              >
                REGISTER
              </Button>
              <Link className="ml-3 btn-link" to="/login" type="submit">
                Login
              </Link>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
