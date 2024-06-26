import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Card from '../../Components/Card';
import FilterBy from '../../Components/FilterBy';
import Pagination from '../../Components/Pagination';
import SortBy from '../../Components/SortBy';
import { ApiConfig } from '../../config/ApiConfig';

/**
 * Renders the Categories page.
 * 
 * @returns {JSX.Element} The Categories component.
 */
const Categories = () => {
  const { category, section, item } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState("asc");
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingQuery(true);
      setProducts([]);
      try {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('name');
        
        const categoriesQuery = [category, section, item]
          .filter(value => value !== null && value !== undefined)
          .map(category => `categories=${category}`)
          .join('&');
        
        const colorQuery = selectedColor ? `&colors=${selectedColor}` : '';
        const sizeQuery = selectedSize ? `&sizes=${selectedSize}` : '';
        const sortQuery = selectedSort ? `&sortBy=${selectedSort}&direction=${selectedOrder}` : '';
        const searchQuery = searchTerm ? `&name=${searchTerm}` : '';
        const pageQuery = `&page=${currentPage - 1}&size=10`;

        const request = `${ApiConfig.products}?${categoriesQuery}${colorQuery}${sizeQuery}${sortQuery}${searchQuery}${pageQuery}`;
        const response = await fetch(request);
        
        const data = await response.json();
        if (data._embedded) {
          setProducts(data._embedded.productList || []);
          setTotalPages(data.page.totalPages);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingQuery(false);
      }
    };

    fetchProducts();
  }, [category, section, item, selectedColor, selectedSize, selectedSort, selectedOrder, location.search, currentPage]);

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${ApiConfig.inventory}unique`);
        const data = await response.json();
        setColors(data.colors || []);
        setSizes(data.sizes || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative flex flex-col sm:flex-row px-4 py-8 mb-20"> {/* Aumenta el margen inferior aquí */}
      <div className="w-full sm:w-1/4 pr-4 mb-4 sm:mb-0 bg-gray-50 rounded-lg m-2">
        <FilterBy
          colors={colors}
          sizes={sizes}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />
        <SortBy
          sortBy={selectedSort}
          order={selectedOrder}
          setSortBy={setSelectedSort}
          setSelectedOrder={setSelectedOrder}
        />
      </div>
      <div className="w-full sm:w-3/4">
        <div className="container mx-auto h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 border border-gray-200 rounded-lg p-4 m-2 h-full">
            {products.map((product) => (
              <Card key={product.id} data={product} />
            ))}
            {loadingQuery && (
              <div className="w-full h-full bg-black opacity-50 rounded-lg col-span-3">
                <div className="flex justify-center items-center w-full h-full">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center m-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;