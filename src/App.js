import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [click, setClick] = useState(false);
  const [editableName, setEditableName] = useState("");
  const [editablePrice, setEditablePrice] = useState("");
  const [idSelector, setIdSelector] = useState("");
  const [isActive, setIsActive] = useState(false);

  /*
  function that requests the 
  data from "http://localhost:3008/products"
  and returns json data
  */
  const get = async () => {
    const pro = await axios.get("http://localhost:3008/products");
    return pro.data;
  };

  /*
  function that get data from the form and posts(add) 
  on "http://localhost:3008/products".
  The click thing in the end of the function,
  was the way that i found to manage the render of
  useEffect to update tha table in real time
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    const prod = { name, price };
    const add = async () => {
      const request = await axios.post("http://localhost:3008/products", prod);
    };
    add();
    if (click === false) {
      setClick(true);
    } else {
      setClick(false);
    }
  };

  /*
    This function change the id selector in order
    to help the updateHandler on the axios.put, that way
    it chooses the right product to update
  */
  const editContactHandler = (id) => {
    setIdSelector(id);
    setIsActive(true);
  };
  /*
    This function updates trough the editable form, 
    choosen by the idSelector. After that, we see the click "thing",
    and then setIsActive to false in order to close the pop-up
  */
  const updateHandler = (e) => {
    e.preventDefault();
    const prod = { name: editableName, price: editablePrice };
    const update = async () => {
      const request = await axios.put(
        `http://localhost:3008/products/${idSelector}`,
        prod
      );
    };
    update();
    if (click === false) {
      setClick(true);
    } else {
      setClick(false);
    }
    setIsActive(false);
  };

  /*
    This function removes the product choosen,
    the "id" comes from the product.id.
    look at the create() function
  */
  const removeContactHandler = async (id) => {
    await axios.delete(`http://localhost:3008/products/${id}`);
    console.log(id);
    if (click === false) {
      setClick(true);
    } else {
      setClick(false);
    }
  };

  /*
    This function that creates the table by maping
    the "products" state fixed by the settingProducts()
     function inside the useEffect().
  */
  function create() {
    return products.map(function (product) {
      return (
        <tr>
          <td>{product.name}</td>
          <td>{product.price}</td>
          <td>
            <button onClick={() => removeContactHandler(product.id)}>X</button>
          </td>
          <td>
            <button onClick={() => editContactHandler(product.id)}>X</button>
          </td>
        </tr>
      );
    });
  }

  /*
    useEffect is a Hook that renders everytime
    somethimng happens, more specifically, when
    a "click" state changes.(look inside the brackets)
  */
  useEffect(() => {
    //Here occurs the fetching of the data and sets the "products" state
    const settingProducts = async () => {
      const prod = await get();
      setProducts(prod);
    };
    settingProducts();
  }, [click]);

  return (
    <>
      <div className="app">
        <div className="table">
          <table>
            <tr>
              <th>product</th>
              <th>price</th>
            </tr>
            {create()}
          </table>
        </div>
        <div className="inputs">
          <form onSubmit={handleSubmit}>
            <label>name:</label>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>price:</label>
            <input
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button>Submit</button>
          </form>
        </div>
        <div className={isActive ? "editable-shown" : "editable-hidden"}>
          <form onSubmit={updateHandler}>
            <label>name:</label>
            <input
              name="name"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
            />
            <label>price:</label>
            <input
              name="price"
              value={editablePrice}
              onChange={(e) => setEditablePrice(e.target.value)}
            />
            <button>Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
