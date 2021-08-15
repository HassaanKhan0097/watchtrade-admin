import React, { useState, useEffect } from "react";
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

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      
      Axios.get('/users/')
      .then(async response => {
        console.log("users list -->",response.data)
        setUsers(response.data);
      })
    };
 
    fetchUsers();
  }, []);


  return (
    <>
      <Container fluid>
        <Row>

          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
              <Card.Title as="h4">Users</Card.Title>
                <p className="card-category">
                  List of registered users:
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">First Name</th>
                      <th className="border-0">Last Name</th>
                      <th className="border-0">User Name</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Type</th>
                    </tr>
                  </thead>
                  <tbody>

                    {
                      users.map((user, ind)=>(
                        <tr>
                          <td>{ind+1}</td>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.userName}</td>
                          <td>{user.email}</td>
                          <td>{user.userType}</td>
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
