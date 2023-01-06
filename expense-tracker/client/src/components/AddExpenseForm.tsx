import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, ToastContainer, Toast, ToastHeader, ToastBody } from 'react-bootstrap';
import IItem from '../models/IItem';
import ProgressIndicator from './common/ProgressIndicator';
import { postItem } from '../services/items';

type Props = {
}

type State = {
    values: {
        payeeName: string,
        product: string,
        price: string,
        setDate: string,
    },
    errors: {
        payeeName: string,
        product: string[],
        price: string[],
        setDate: string[]
    }
    isValid: boolean,
    responseState: 'initial' | 'loading' | 'success' | 'error',
    toastMessage: string,
    show: boolean
}

class AddExpenseForm extends Component<Props, State>{
    state: State = {
        values: {
            payeeName: '',
            product: '',
            price: '0',
            setDate: (new Date()).toISOString().substring(0, 10)
        },
        errors: {
            payeeName: '',
            product: [],
            price: [],
            setDate: []
        },
        isValid: false,
        responseState: 'initial',
        toastMessage: '',
        show: false
    };

    validate(nameOfInput?: keyof State['values']) {
        const errors: State['errors'] = {
            payeeName: '',
            product: [],
            price: [],
            setDate: []
        };
        let isValid = true;

        const {
            payeeName,
            product,
            price,
            setDate
        } = this.state.values;

        if (payeeName !== 'Rahul' && payeeName !== 'Ramesh') {
            errors.payeeName = 'Please choose a correct payee!';
            isValid = false;
        }

        if (product.trim().length < 2) {
            errors.product.push('Expense description should at least have 2 characters!');
            isValid = false;
        } else if (product.trim().length > 50) {
            errors.product.push('Expense description should not exceed 50 characters!');
            isValid = false;
        }

        const pricePat = /^\d+(\.\d{1,2})?$/;
        if (!pricePat.test(price)) {
            errors.price.push('Please enter a valid amount');
            isValid = false;
        }

        if (parseFloat(price) === 0) {
            errors.price.push('Please enter an amount');
            isValid = false;
        }

        const now = new Date();
        if (setDate.trim() === '') {
            errors.setDate.push('Please enter a valid date!');
            isValid = false;
        } else if (now < (new Date(setDate))) {
            errors.setDate.push('Expense cannot be entered on future date!');
            isValid = false;
        }

        if (nameOfInput) {
            this.setState(
                state => {
                    return {
                        errors: {
                            ...state.errors,
                            [nameOfInput]: errors[nameOfInput]
                        },
                        isValid
                    };
                }
            )
            return errors[nameOfInput].length === 0;
        } else {
            this.setState(
                {
                    errors,
                    isValid
                }
            )
            return isValid;
        }
    };

    updateValue = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
        const { name, value } = event.target;
        this.setState(
            state => {
                return {
                    values: {
                        ...state.values,
                        [name]: value
                    }
                };
            },
            () => {
                this.validate(name as keyof State['values'])
            }
        )
    };

    // function uses service method to send data to backend
    addExpense = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // If data validation failed, will not proceed
        if (!this.validate()) {
            return;
        }

        // Using service method to send data to backend
        try {
            this.setState({
                responseState: 'loading'
            });
            const postedItem = await postItem(this.state['values'] as IItem);
            // If data updated successfully updated, state changes accordingly
            this.setState({
                responseState: 'success',
                toastMessage: `Expense added with id: ${postedItem.id}`,
                show: true,
                values: {
                    payeeName: '',
                    product: '',
                    price: '0',
                    setDate: (new Date()).toISOString().substring(0, 10)
                }
            });
        } catch (error) {
            this.setState({
                responseState: 'error',
                toastMessage: (error as Error).message,
                show: true
            });
        };
    };

    render() {
        const {
            payeeName,
            product,
            price,
            setDate
        } = this.state.values;

        const {
            payeeName: payeeNameErr,
            product: productErr,
            price: priceErr,
            setDate: setDateErr
        } = this.state.errors;

        const isValid = this.state.isValid;
        const { responseState, toastMessage, show } = this.state;

        return (
            <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <div className='exp-container'>
                    <Card style={{ width: "36rem" }} className="p-3">
                        <h2 className='my-3'>Add an expense</h2>
                        <hr />
                        <Form onSubmit={this.addExpense} >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Paid by:</Form.Label>
                                <Form.Select aria-label="Default select example"
                                    name="payeeName"
                                    value={payeeName}
                                    onChange={this.updateValue}
                                    isInvalid={payeeNameErr.length !== 0}>
                                    <option>Select a payee name</option>
                                    <option value="Rahul">Rahul</option>
                                    <option value="Ramesh">Ramesh</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Paid for:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="product"
                                    placeholder="Expense description"
                                    value={product}
                                    onChange={this.updateValue}
                                    isInvalid={productErr.length !== 0}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {
                                        productErr.map(
                                            err => <div key={err}>{err}</div>
                                        )
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Amount paid:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="price"
                                    value={price}
                                    onChange={this.updateValue}
                                    placeholder="How much do you spent?"
                                    isInvalid={priceErr.length !== 0}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {
                                        priceErr.map(
                                            err => <div key={err}>{err}</div>
                                        )
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Date:</Form.Label>
                                <Form.Control
                                    type="date"
                                    name='setDate'
                                    value={setDate}
                                    onChange={this.updateValue}
                                    isInvalid={setDateErr.length !== 0}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {
                                        setDateErr.map(
                                            err => <div key={err}>{err}</div>
                                        )
                                    }
                                </Form.Control.Feedback>
                            </Form.Group>
                            <hr />
                            <div className='d-flex justify-content-center'>
                                <Link to='/'>
                                    <Button variant="secondary" className='me-2'>
                                        Close
                                    </Button>
                                </Link>
                                <Button variant="primary" type="submit" disabled={!isValid}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
                {
                    responseState === 'loading' && (
                        <ProgressIndicator />
                    )
                }
                {
                    (responseState === 'success' || responseState === 'error') && (
                        <ToastContainer className='p-3' position='top-end'>
                            <Toast
                                bg={responseState === 'success' ? 'success' : 'danger'}
                                show={show}
                                autohide
                                delay={5000}
                                onClose={() => this.setState({ show: false })}
                            >
                                <ToastHeader closeButton={false}>
                                    {responseState === 'success' ? 'Success' : 'Error'}
                                </ToastHeader>
                                <ToastBody >
                                    {toastMessage}
                                </ToastBody>
                            </Toast>
                        </ToastContainer>
                    )
                }
            </div>
        )
    }
}

export default AddExpenseForm;