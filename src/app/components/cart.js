'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = ({project}) => {
    const [cart, setCart] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [price,setPrice] = useState(100)


    useEffect(() => {
        // Fetch the existing cart data on mount
        const fetchCart = async () => {
          try {
            const response = await axios.get("http://localhost:8080/api/cart/items");
            setCart(response.data);
          } catch (error) {
            console.error("Error fetching cart:", error);
          }
        };
    
        fetchCart();
      }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/cart/items");
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const add = () => {
        setQuantity((prev) => prev + 1);
      };
      
    const remove = () => {
        setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
    };


    const addToCart = async (productId,productName) => {
        if (!project) {
            console.error("Project is undefined");
            return;
          }

        try {
            const response = await axios.post("http://localhost:8080/api/cart/add", { productId, productName, quantity, price});
            setCart(response.data);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };
    const updateCart = async (productId, quantity) => {
        try {
          if(quantity<0){
            if(quantity<=cart[productId].quantity){
              const response = await axios.post("http://localhost:8080/api/cart/update", { productId, quantity });
              setCart(response.data);
            }
          }else{
            const response = await axios.post("http://localhost:8080/api/cart/update", { productId, quantity });
            setCart(response.data);

          }
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await axios.post("http://localhost:8080/api/cart/remove", productId, {
                headers: { "Content-Type": "application/json" },
            });
            setCart(response.data);
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    return (
        <div className='grad_border' style={{display:'flex',height:'fit-content',justifyContent:'center',alignItems:'center',flexDirection:'column',gap:'1rem',padding:'2rem 4rem',marginTop:'6rem',marginRight:'3rem'}}>
            <h3 className='grad_text'>OFFSET WITH <br/> THIS PROJECT</h3>
            <span style={{display:'flex',gap:'10px',justifyContent:'center'}}>
                <button style={{color:'#37AE56',width:'2rem',fontSize:'large',backgroundColor:'white',border:'none'}} onClick={remove}>-</button>
                <h3 id='quantity' style={{border:'2px solid grey',padding:'.5rem 3rem'}}>{quantity}</h3>
                <button style={{color:'#37AE56',width:'2rem',fontSize:'large',backgroundColor:'white',border:'none'}} onClick={add}>+</button>
            </span>
            <p>price</p>
            <button className="grad_border" style={{color:'white',backgroundImage:'linear-gradient(to right,#37AE56,#1A93D7)',fontWeight:'bold',paddingBlock:'1rem',width:'13rem',backgroundColor:'white'}}>Buy Now</button>
            <button className="grad_border grad_text" style={{paddingBlock:'1rem',width:'13rem',backgroundColor:'white',fontWeight:'bold'}} onClick={() => addToCart(project.projectid,project.projectName)}>Add to Cart</button>
        </div>
    );
};

export default Cart;