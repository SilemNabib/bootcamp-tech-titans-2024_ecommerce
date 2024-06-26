import { CheckIcon, PlusIcon } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from '../../Context';
import { useAuth } from '../../Context/AuthContext';
import { ApiConfig } from '../../config/ApiConfig';
import SelectColor from '../SelectColor';
import SelectSize from '../SelectSize';

/**
 * Card component displays a product card with image, name, price, color selection, and size selection.
 *
 * @param {Object} data - The data object containing information about the product.
 * @returns {JSX.Element} The rendered Card component.
 */
const Card = ({ data }) => {
  const context = useContext(GlobalContext);
  const auth = useAuth();
  const { setProductToShow } = context;
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const productInCart = cart.some(cartItem => cartItem.inventory.product.id === data.id);
    setIsInCart(productInCart);
  }, [data.id]);

  const showProduct = () => {
    setProductToShow(data);
  };

  const addToCart = async () => {
    context.setLoading(true);
    try {
      if (!selectedColor || !selectedSize) {
        toast.error('Please select color and size', { toastId: 'selectError' });
        return;
      }

      const inventory = data.inventories.find(inventory => inventory.color.name === selectedColor && inventory.size === selectedSize);
      if (!inventory) {
        toast.error('Selected combination is not available', { toastId: 'inventoryError' });
        return;
      }

      if (!inventory || inventory.stock === 0) {
        toast.error('Variant out of stock');
        return;
      }

      const response = await auth.authFetch(ApiConfig.cart.add, {
        method: 'POST',
        data: JSON.stringify({
          inventoryId: inventory.id,
          amount: 1,
        }),
      });

      if (response.status === 200) {
        const items = response.data.data;
        sessionStorage.setItem('cart', JSON.stringify(items));
        setIsInCart(true);
      } else {
        setIsInCart(false);
        toast.error('Error adding product to cart', { toastId: 'apiError' });
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setIsInCart(false);
      toast.error(`Error adding product to cart. Please log in to add products to cart.`, { toastId: 'authError' });
    }
    context.setLoading(false);
  };

  const colors = data?.inventories?.map(inventory => ({ name: inventory.color.name, code: inventory.color.code })) || [];
  const sizes = data?.inventories?.map(inventory => inventory.size) || [];
  const titleCaseName = data.name.replace(/\b(\w)/g, s => s.toUpperCase());

  return (
    <div className='bg-white cursor-pointer w-full shadow-lg rounded-lg overflow-hidden flex flex-col'>
      <figure className='relative w-full h-2/3'>
        <Link to={`/product-detail/${data.id}`} onClick={showProduct}>
          <img className='w-full h-full object-cover' src={data.productImages[0].url} alt={data.name} />
        </Link>
        <div
          className={`absolute top-0 right-0 flex justify-center items-center w-8 h-8 rounded-full m-2 p-1 ${isInCart ? 'bg-green-500' : 'bg-white'}`}
          onClick={isInCart ? undefined : addToCart}
        >
          {context.loading ? null: isInCart ? <CheckIcon className="size-8 text-white" /> : <PlusIcon className="size-8 text-black" />}
        </div>
      </figure>
      <div className='p-4 h-44'>
        <span className='block text-center text-gray-900 font-semibold text-lg mb-2 overflow-ellipsis overflow-hidden whitespace-nowrap'>{titleCaseName}</span>
        <span className='block text-gray-900 font-bold text-sm mt-2 mb-2'>${data.price}</span>
        <SelectColor colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} />
        <SelectSize sizes={sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
      </div>
      <ToastContainer limit={1} />
    </div>
  );
};

Card.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productImages: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired
    })).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    inventories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      color: PropTypes.shape({
        name: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
      }).isRequired,
      size: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default Card;
