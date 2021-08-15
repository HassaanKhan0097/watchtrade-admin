import React, { useState, useEffect, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DateTimePicker from 'react-datetime-picker';
// import FileBase64 from 'react-file-base64';


import { Link } from 'react-router-dom';
import Axios from "../AxiosService";
import Moment from 'react-moment';
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
var qs = require('qs');


function ProductCreate(props) {

  const [product, setProduct] = useState({
    "userId": "-1",
    "name": "",
    "brand": "",
    "modelNo": "",
    "auctionExpireAt": new Date(),
    "startingPrice": "",
    "status": "-1",
    "watchAge": new Date(),
    "movement": "",
    "case": "",
    "bracelet": "",
    "dial": "",
    "lot": "",
    "papers": "-1",
    "box": "-1",
    "location": "",
    "currency": "",
    "description": "",
    "images": [],
  });
  // const [value, onChange] = useState(new Date());
  // console.log(value)

  const [users, setUsers] = useState([]);
  const [createProductError, setCreateProductError] = useState(false);
  const [createProductValidationErrors, setCreateProductValidationErrors] = useState({});

  // IMAGES
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");




  const uploadImage = () => {
    console.log("upload image called!")

    return new Promise(function (resolve, reject) {


      var images = [];
      //First Image
      const data = new FormData()
      data.append("file", image1)
      data.append("upload_preset", "watchtrade")
      data.append("cloud_name", "dpwsudsmt")

      fetch("https://api.cloudinary.com/v1_1/dpwsudsmt/image/upload", {
        method: "post",
        body: data
      })

        .then(resp => resp.json())
        .then(data => {
          // addUrl(data.url);
          images.push(data.url);

          //Second Image
          const data2 = new FormData()
          data2.append("file", image2)
          data2.append("upload_preset", "watchtrade")
          data2.append("cloud_name", "dpwsudsmt")

          fetch("https://api.cloudinary.com/v1_1/dpwsudsmt/image/upload", {
            method: "post",
            body: data2
          })

            .then(resp => resp.json())
            .then(data => {
              // addUrl(data.url);
              images.push(data.url);
              // console.log("final image array on up -->", images)
              // setProduct(setProductState("images", images))
              resolve(images);

            })
            .catch(err => reject(err))


          // setProduct(setProductState("images",urls))
        })
        .catch(err => reject(err))


    });




  }


  const setProductState = (key, value) => {
    let _product = Object.assign({}, product)
    _product[key] = value
    return _product
  }

  const handleValidation = () => {

    let errors = {};
    let isValid = true;
    if (product.name === "") {
      errors["name"] = "Name is required";
      isValid = false;
    }
    if (product.brand === "") {
      errors["brand"] = "Brand is required";
      isValid = false;
    }
    if (product.modelNo === "") {
      errors["modelNo"] = "Model # is required";
      isValid = false;
    }
    if (product.startingPrice === "") {
      errors["Starting Price"] = "Starting Price is required";
      isValid = false;
    }
    if (product.movement === "") {
      errors["movement"] = "Movement is required";
      isValid = false;
    }
    if (product.case === "") {
      errors["case"] = "Case is required";
      isValid = false;
    }




    if (product.bracelet === "") {
      errors["bracelet"] = "Bracelet is required";
      isValid = false;
    }
    if (product.dial === "") {
      errors["dial"] = "Dial is required";
      isValid = false;
    }
    if (product.lot === "") {
      errors["lot"] = "Lot is required";
      isValid = false;
    }
    if (product.papers === "-1") {
      errors["papers"] = "Papers is required";
      isValid = false;
    }
    if (product.box === "-1") {
      errors["box"] = "Box is required";
      isValid = false;
    }
    if (product.location === "") {
      errors["location"] = "Location is required";
      isValid = false;
    }



    if (product.currency === "") {
      errors["currency"] = "Currency is required";
      isValid = false;
    }
    // if( product.name === "" ){
    //   errors["Name"] = "Name is required";
    //   isValid = false;
    // }
    // if( product.name === "" ){
    //   errors["Name"] = "Name is required";
    //   isValid = false;
    // }
    if (product.status === "-1") {
      errors["status"] = "Status is required";
      isValid = false;
    }

    if (product.userId === "-1") {
      errors["userId"] = "Owner is required";
      isValid = false;
    }


    if (image1 === "") {
      errors["image1"] = "Image is required";
      isValid = false;
    }
    if (image2 === "") {
      errors["image2"] = "Image is required";
      isValid = false;
    }
    if (product.description === "") {
      errors["description"] = "Description is required";
      isValid = false;
    }

    setCreateProductValidationErrors(errors)
    return isValid;

  }

  const formSubmission = (e) => {
    // e.preventDefault()

    if (!handleValidation()) { return }

    //Image Upload
    // uploadImage().then((images) => {
    //   console.log('Image Uploaded', images);
    //   setProduct(setProductState("images", images))



    // });


    Axios.post('/products/create', product)
      .then(async response => {
        console.log(response.data)

        //Now update the images
        uploadImage().then((images) => {
          console.log('Image Uploaded on cloudinary now saving to db', images);
          debugger;
          console.log("Update id ->", response.data.data._id)
          Axios.post('/products/update/' + response.data.data._id, { images: images })
            .then(async response => {
              props.history.push("/admin/products/")
            })
            .catch(error => {
              // this.setState({ errorMessage: error.toString() });
              console.error('There was an error!', error);
              setCreateProductError(true);
            });


        });

      })
      .catch(error => {
        // this.setState({ errorMessage: error.toString() });
        console.error('There was an error!', error);
        setCreateProductError(true);
      });



  }


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
            <Card>
              <Card.Header>
                <Card.Title as="h4">Create Product</Card.Title>
              </Card.Header>
              <Card.Body>

                <Form>


                  <Row>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label>Name</label>
                        <Form.Control
                          value={product.name}
                          placeholder="Name"
                          onChange={(e) => setProduct(setProductState("name", e.target.value))}
                          type="text"
                        ></Form.Control>

                        {
                          createProductValidationErrors["name"] ? (<div className="custom-error">
                            {createProductValidationErrors["name"]}
                          </div>) : (null)
                        }

                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Brand </label>
                        <Form.Control placeholder="Brand" value={product.brand} type="text"
                          onChange={(e) => setProduct(setProductState("brand", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["brand"] ? (<div className="custom-error">
                            {createProductValidationErrors["brand"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Model # </label>
                        <Form.Control placeholder="Model #" value={product.modelNo} type="text"
                          onChange={(e) => setProduct(setProductState("modelNo", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["modelNo"] ? (<div className="custom-error">
                            {createProductValidationErrors["modelNo"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                  </Row>




                  <Row>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label>Starting Price</label>
                        <Form.Control
                          value={product.startingPrice}
                          onChange={(e) => setProduct(setProductState("startingPrice", e.target.value))}
                          placeholder="Starting Price"
                          type="number"
                        ></Form.Control>
                        {
                          createProductValidationErrors["startingPrice"] ? (<div className="custom-error">
                            {createProductValidationErrors["startingPrice"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Movement </label>
                        <Form.Control placeholder="Movement" value={product.movement} type="text"
                          onChange={(e) => setProduct(setProductState("movement", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["movement"] ? (<div className="custom-error">
                            {createProductValidationErrors["movement"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Case </label>
                        <Form.Control placeholder="Case" value={product.case} type="text"
                          onChange={(e) => setProduct(setProductState("case", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["case"] ? (<div className="custom-error">
                            {createProductValidationErrors["case"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                  </Row>



                  <Row>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label>Bracelet</label>
                        <Form.Control
                          value={product.bracelet}
                          placeholder="Bracelet"
                          onChange={(e) => setProduct(setProductState("bracelet", e.target.value))}
                          type="text"
                        ></Form.Control>
                        {
                          createProductValidationErrors["bracelet"] ? (<div className="custom-error">
                            {createProductValidationErrors["bracelet"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Dial </label>
                        <Form.Control placeholder="Dial" value={product.dial} type="text"
                          onChange={(e) => setProduct(setProductState("dial", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["dial"] ? (<div className="custom-error">
                            {createProductValidationErrors["dial"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Lot </label>
                        <Form.Control placeholder="Lot" value={product.lot} type="number"
                          onChange={(e) => setProduct(setProductState("lot", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["lot"] ? (<div className="custom-error">
                            {createProductValidationErrors["lot"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                  </Row>



                  <Row>

                    <Col className="pr-3" md="4">
                      <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Papers</Form.Label>
                        <Form.Control as="select" custom
                          value={product.papers}
                          onChange={(e) => setProduct(setProductState("papers", e.target.value))}>
                          <option disabled="disabled" value="-1">Select</option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </Form.Control>
                        {
                          createProductValidationErrors["papers"] ? (<div className="custom-error">
                            {createProductValidationErrors["papers"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Box</Form.Label>
                        <Form.Control as="select" custom
                          value={product.box}
                          onChange={(e) => setProduct(setProductState("box", e.target.value))}>
                          <option disabled="disabled" value="-1">Select</option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </Form.Control>
                        {
                          createProductValidationErrors["box"] ? (<div className="custom-error">
                            {createProductValidationErrors["box"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Location </label>
                        <Form.Control placeholder="Location" value={product.location} type="text"
                          onChange={(e) => setProduct(setProductState("location", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["location"] ? (<div className="custom-error">
                            {createProductValidationErrors["location"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                  </Row>


                  <Row>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Currency </label>
                        <Form.Control placeholder="Currency" value={product.currency} type="text"
                          onChange={(e) => setProduct(setProductState("currency", e.target.value))}
                        ></Form.Control>
                        {
                          createProductValidationErrors["currency"] ? (<div className="custom-error">
                            {createProductValidationErrors["currency"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>
                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Auction Expire at </label>
                        <DateTimePicker
                          onChange={(e) => setProduct(setProductState("auctionExpireAt", e))}
                          minDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                          value={new Date(product.auctionExpireAt)}
                          style={{ display: 'inline', height: '40px' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pr-3" md="4">
                      <Form.Group>
                      <label htmlFor="exampleInputEmail1"> Your Watch Age </label>
                        <DateTimePicker
                          onChange={(e) => setProduct(setProductState("watchAge", e))}
                          maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                          value={new Date(product.watchAge)}
                          style={{ display: 'inline', height: '40px' }}
                        />
                      </Form.Group>
                    </Col>

                  </Row>



                  {/* <Row>

                    <Col className="pr-3" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1"> Watch Age </label>
                        <DateTimePicker
                          onChange={(e)=>setProduct(setProductState("auctionExpireAt",e.target.value))}
                          value={ new Date(product.auctionExpireAt) }
                        />
                      </Form.Group>
                    </Col>

                  </Row> */}


                  <Row>

                    <Col className="pr-3" md="4">
                      <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Status</Form.Label>
                        <Form.Control as="select" custom
                          value={product.status}
                          onChange={(e) => setProduct(setProductState("status", e.target.value))}>
                          <option value="-1">Select</option>
                          <option value="pending">pending</option>
                          <option value="deactivated">deactivated</option>
                          <option value="live">live</option>
                          <option value="finished">finished</option>
                          <option value="sold">sold</option>
                        </Form.Control>
                        {
                          createProductValidationErrors["status"] ? (<div className="custom-error">
                            {createProductValidationErrors["status"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>

                    <Col className="pr-3" md="8">
                      <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Owner</Form.Label>
                        <Form.Control as="select" custom
                          value={product.userId}
                          onChange={(e) => setProduct(setProductState("userId", e.target.value))}>
                            <option disabled="disabled" value="-1">Select</option>
                            {
                              users.map((user)=>{
                                return <option value={user._id}>{user.userName}</option>
                              })
                            }
                          
                        </Form.Control>
                        {
                          createProductValidationErrors["userId"] ? (<div className="custom-error">
                            {createProductValidationErrors["userId"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>
                  </Row>




                  <Row>
                    <Col md="6">
                      <Form.Group>
                        <label>Image 1</label>
                        <Form.Control type="file"
                          onChange={(e) => setImage1(e.target.files[0])}
                        ></Form.Control>
                        {
                          createProductValidationErrors["image1"] ? (<div className="custom-error">
                            {createProductValidationErrors["image1"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>
                    <Col md="6">
                      <Form.Group>
                        <label>Image 2</label>
                        <Form.Control type="file"
                          onChange={(e) => setImage2(e.target.files[0])}
                        ></Form.Control>
                        {
                          createProductValidationErrors["image2"] ? (<div className="custom-error">
                            {createProductValidationErrors["image2"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>
                  </Row>






                  {/* <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Description</label>
                        <CKEditor
                            editor={ ClassicEditor }
                            config={{
                              removePlugins: ['Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed']
                            }}
                            data={product.description}
                            config={{
                              ckfinder: {
                                  uploadUrl: 'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                              }
                            } }
                            onReady={ editor => {
                              console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                              const data = editor.getData();
                              console.log( { event, editor, data } );
                              setProduct(setProductState("description", data))
                            } }
                        />
                      </Form.Group>
                    </Col>
                  </Row> */}



                  <Row>
                    <Col md="12">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control onChange={(e) => setProduct(setProductState("description", e.target.value))} value={product.description} as="textarea" rows={3} />
                        {
                          createProductValidationErrors["description"] ? (<div className="custom-error">
                            {createProductValidationErrors["description"]}
                          </div>) : (null)
                        }
                      </Form.Group>
                    </Col>
                  </Row>


                  <Button
                    className="btn-fill pull-right"
                    type="button"
                    variant="info"
                    onClick={() => formSubmission()}
                  >
                    Create Product
                  </Button>

                  {createProductError ? <div className="alert alert-danger mt-15" role="alert">
                    <i className="fa fa-exclamation-circle"></i> Product Creation Failed!
                  </div> : null}


                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Bid History</Card.Title>
                <p className="card-category">  </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">S.No</th>
                      <th className="border-0">User</th>
                      <th className="border-0">Time</th>
                      <th className="border-0">Amount</th>
                      <th className="border-0">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  {product.bidHistory.map((bid, index) =>(
                    <tr key={"bid"+index}>
                      <td>{index+1}</td>
                      <td>{bid.userId}</td>
                      <td>
                        <Moment format="MM/DD/YYYY hh:mm:ss">{bid.bidTime}</Moment>
                      </td>
                      <td>${bid.bidAmount}</td>
                      <td>{bid.status}</td>
                      
                    </tr>
                  ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
}

export default ProductCreate;
