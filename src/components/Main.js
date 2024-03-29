import { useContext, useEffect } from "react";
import { Card, Col, Row, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartContext from "../store/cart-context";

const Main = (props) => {
  const cartCtx = useContext(CartContext);

  const addItems = (item) => {
    cartCtx.addItem({
      id: item.id,
      title: item.title,
      quantity: 1,
      price: item.price,
      imageUrl: item.imageUrl,
    });
  };

  useEffect(() => {
    getItems();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function addCartItem() {
      const email = localStorage.getItem("email");
      const user = email.substring(0, email.indexOf("."));
      const response = await fetch(
        `https://ecommerce-project-6271e-default-rtdb.firebaseio.com/cart-${user}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            items: cartCtx.items,
            totalAmount: cartCtx.totalAmount,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    }
    addCartItem();
  }, [cartCtx.items, cartCtx.totalAmount]);

  const getItems = async () => {
    const emailId = localStorage.getItem("email");
    const user = emailId.substring(0, emailId.indexOf("."));
    const res = await fetch(
      `https://ecommerce-project-6271e-default-rtdb.firebaseio.com/cart-${user}.json`
    );
    const data = await res.json();

    data && data.items && cartCtx.setItems(data.items, data.totalAmount);
  };

  const clickHandler = (item) => {
    addItems(item);
  };

  return (
    <Container fluid className="p-5">
      <h2 className="text-center mb-5 fw-bold">PRODUCTS</h2>
      <Row className="g-4 justify-content-center">
        {props.products.map((item) => (
          <Col xs={12} sm={6} xl={4} key={item.id}>
            <Card border="white text-white">
              <Link to={`/store/${item.id}`}>
                <Card.Img
                  variant="top"
                  src={item.imageUrl}
                  className="rounded-4"
                />
              </Link>
              <Card.Body className="bg-dark bg-gradient rounded-4">
                <Card.Title className="text-center pb-3 fs-4">
                  {item.title}
                </Card.Title>
                <Card.Text className="d-flex justify-content-between align-items-center fs-5">
                  Rs {item.price}
                  <Button variant="info" onClick={() => clickHandler(item)}>
                    Add to Cart
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Main;
