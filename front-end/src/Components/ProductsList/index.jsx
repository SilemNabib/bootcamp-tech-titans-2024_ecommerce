import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { ApiConfig } from '../../config/ApiConfig';
import ProductInfo from '../ProductInfo';

const ProductsList = () => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(ApiConfig.products);
        const data = await response.json();
        setProducts(data._embedded.productList);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  if (!products) {
    return <CircularProgress />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {products.map(product => (
        <ProductInfo key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;