import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Button, Container, Card, Row } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      review: '',
      books: [],
      update: '',
    };
  }

  handleChange = (event) => {
    const name = event.target.name;
    const val = event.target.value;
    
    this.setState({
      [name]: val
    });
  };

  handleUpdate = (event) => {
    this.setState({
      update: event.target.value,
    });
  };

  componentDidMount() {
    axios.get("/api/books").then((response) => {
      console.log("API_BOOKS_RESPONSE", response.data)
      if (response.data.success) {
        this.setState({
          books: response.data.data
        })
      }
    }).catch((err) => {
      console.log({ error: err.response.data, status: err.response.status });
      return;
    });;
  }

  getBookData = (update = false) => {
    const data = { name: this.state.name, review: this.state.review };
    if (update) {
      data.review = this.state.update;
    }
    console.log("BOOK_DATA", data, this.state);
    return data;
  }

  submit = () => {
    axios.post("/api/books", this.getBookData())
      .then((response) => {
        console.log("API_REVIEW_RESPONSE", response.data);
      }).catch((err) => {
        console.log({ error: err.response.data, status: err.response.status });
        return;
      });
    
    document.location.reload();// to fetch the reviewed book
  };

  remove = (id) => {
    if (window.confirm("Do you want to delete? ")) {
      axios
        .delete(`/api/books/${id}`)
        .then((response) => {
          console.log("API_DELETE_RESPONSE", response.data);
        })
        .catch((err) => {
          console.log({ error: err.response.data, status: err.response.status });
          return;
        });
      document.location.reload();
    }
  };

  review = (id) => {
    axios
      .put(`/api/books/${id}`, this.getBookData(true))
      .catch((err) => {
        console.log({ error: err.response.data, status: err.response.status });
        return;
    });
    document.location.reload();
  };

  render() {
    const card = this.state.books.map((val, key) => {
      return (
        <React.Fragment key={key}>
          <Card style={{ width: "18rem"}} className="m-2">
            <Card.Body>
              <Card.Title>{val.name}</Card.Title>
              <Card.Text>{val.review}</Card.Text>
              <input name="update" onChange={this.handleUpdate} placeholder="Update Review" />
              <Button className="m-2" onClick={() => { this.review(val.id) }}>Update</Button>
              <Button onClick={ () => { this.remove(val.id) }}>Delete</Button>
            </Card.Body>
          </Card>
        </React.Fragment>
      );
    });
    return (
      <div className="App">
        <h1>Dockerized Fullstack React App</h1>
        <div className="form">
          <input name="name" placeholder="Enter book name" onChange={this.handleChange} />
          <input name="review" placeholder="Enter review" onChange={this.handleChange} />
        </div>
        <Button className="my-2" variant="primary" onClick={this.submit}>Submit</Button>
        <Container>
          <Row>
            {card}
          </Row>
        </Container>
      </div>
    );
  }
}
export default App;
