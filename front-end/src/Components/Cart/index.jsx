import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { ApiConfig } from '../../config/ApiConfig';

/**
 * Renders the shopping cart component.
 * @param {Object} props - The component props.
 * @param {boolean} props.editable - Indicates whether the cart is editable or not. Defaults to true.
 * @returns {JSX.Element} The rendered cart component.
 */
function Cart({editable = true}) {
  const auth = useAuth();
  const [carts, setCarts] = useState(null);
  const [total, setTotal] = useState(null);

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  
  const setData = (response) => {
    if (response.status === 200) {
      const items = response.data.data;
      setCarts(items);
      setTotal(items.reduce((acc, item) => acc + item.inventory.product.price * item.cartStock, 0));
      sessionStorage.setItem('cart', JSON.stringify(items));
    }
  }

  const getCart = async () => {
    const response = await auth.authFetch(ApiConfig.cart.get)
    setData(response);
  }

  useEffect(() => {
    getCart();
  }, []);

  const handleInc = async (id) => {
    setCarts(carts.map(cart => {
      if (cart.inventory.id === id) {
        return { ...cart, cartStock: cart.cartStock + 1 };
      }
      return cart;
    }));

    const response = await auth.authFetch(ApiConfig.cart.add,
      {
        method: 'POST',
        data: JSON.stringify({
          inventoryId: id,
          amount: 1, 
        }),
      }
    )
    setData(response);
  };

  const handleDec = async (id) => {
    setCarts(carts.map(cart => {
      if (cart.inventory.id === id) {
        return { ...cart, cartStock: cart.cartStock - 1 };
      }
      return cart;
    }));

    const response = await auth.authFetch(`${ApiConfig.cart.remove}${id}?amount=1`,
      {
        method: 'DELETE',
      }
    )
    
    setData(response);
  };

  const removeProduct = async (id) => {
    setCarts(carts.filter(cart => cart.inventory.id !== id));

    const response = await auth.authFetch(`${ApiConfig.cart.remove}${id}`,
      {
        method: 'DELETE',
      }
    )
    
    setData(response);
  };

  if(!carts) return (<CircularProgress/>);

  if (carts?.length === 0) {
    return <h1 className="h-[55vh] flex justify-center items-center text-4xl">Cart is Empty</h1>;
  }

  return (
    <div className="container mx-auto">
      <div className="w-full max-h-96 overflow-y-scroll">
        <div className="bg-white px-10 py-1">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{carts?.length} Items</h2>
          </div>
          <div className="flex flex-wrap mt-10 mb-5">
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Quantity</h3>
            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Price</h3>
            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Total</h3>
          </div>
          {carts?.map(cart => (
            <div key={cart.cartItemId} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
              <div className="flex w-2/5">
                <div className="w-20">
                  <img className="h-24" src={cart.inventory.product.productImages[0].url} alt={cart.inventory.product.name} />
                </div>
                <div className="flex flex-col justify-between ml-4 flex-grow">
                  <span className="font-bold text-sm">{toTitleCase(cart.inventory.product.name)}</span>
                  <span className="font-light text-sm">{cart.inventory.size} - {cart.inventory.color.name}</span>
                  { editable &&
                    (
                      <div
                        className="font-semibold hover:text-red-500 text-gray-500 text-xs cursor-pointer"
                        onClick={() => removeProduct(cart.inventory.id)}
                      >
                        Remove
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="flex justify-center w-1/5">
                { editable &&
                  (
                    <svg
                      className="fill-current text-gray-600 w-3 cursor-pointer"
                      viewBox="0 0 448 512"
                      onClick={() => handleDec(cart.inventory.id)}
                    >
                      <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                  )
                }
                <input className="mx-2 border text-center w-8" type="text" value={cart.cartStock} readOnly />
                {
                  editable &&
                  (
                    <svg
                      className="fill-current text-gray-600 w-3 cursor-pointer"
                      viewBox="0 0 448 512"
                      onClick={() => handleInc(cart.inventory.id)}
                    >
                      <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                  )
                }
              </div>
              <span className="text-center w-1/5 font-semibold text-sm">${cart.inventory.product.price}</span>
              <span className="text-center w-1/5 font-semibold text-sm">
                ${(cart.inventory.product.price * cart.cartStock)}
              </span>
            </div>
          ))}
          <div className='w-full flex flex-row justify-end items-center px-4'>
            <span>Total: </span>
            <span className='font-bold text-2xl ml-2'>${total}</span>
          </div>
          { editable &&
            (
              <Link to="/checkout/address" className="flex font-semibold text-gray-900 text-sm mt-5">
                <button className="w-full py-3 flex justify-center rounded-lg font-bold text-lg bg-black text-white">
                  Buy now
                </button>
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Cart;