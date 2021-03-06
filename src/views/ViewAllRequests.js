import React, { useState, useEffect } from 'react';
import Axios from "../AxiosService";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function TableList() {

  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    Axios.get('/sells/')
        .then(async response => {
          console.log(response.data)
          setRequests(response.data)
          console.log("Sells -->", response.data)
        })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
            // console.error('There was an error!', error);
        });
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
          
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Requests</Card.Title>
                <p className="card-category">
                  List of pending sell requests:
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">First Name</th>
                      <th className="border-0">Last Name</th>
                      <th className="border-0">Mobile#</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Country</th>
                      <th className="border-0">Brand</th>
                      <th className="border-0">Model Number</th>
                      <th className="border-0">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                   
                      {
                        requests.map((req, ind)=>(
                          <tr>
                            <td>{ind+1}</td>
                            <td>{req.firstName}</td>
                            <td>{req.lastName}</td>
                            <td>{req.mobileNo}</td>
                            <td>{req.email}</td>
                            <td>{req.country}</td>
                            <td>{req.brand}</td>
                            <td>{req.modelNo}</td>
                            <td>{req.details}</td>
                          </tr>
                        ))
                      }               

                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Container>
    </>
  );
}

export default TableList;
