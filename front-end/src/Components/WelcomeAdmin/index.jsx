import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { ApiConfig } from '../../config/ApiConfig';

/**
 * Renders the WelcomeAdmin component.
 * This component displays a welcome message and provides a list of actions that can be performed in the admin dashboard.
 */
const WelcomeAdmin = () => {
  const [adminInfo, setAdminInfo] = useState({ firstName: '', lastName: '' });
  const auth = useAuth();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await auth.authFetch(ApiConfig.profile);
        const { firstName, lastName } = response.data;
        setAdminInfo({ firstName, lastName });
      } catch (error) {
        console.error("Failed to fetch admin profile", error);
      }
    };

    fetchAdminProfile();
  }, [auth]);

  return (
    <div className=" bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, 👋 {adminInfo.firstName} {adminInfo.lastName}</h2>        
          <p className="mt-2 text-gray-600">You are in the Admin Dashboard. Here are some of the things you can do:</p>
          <ul className="list-disc pl-5 mt-4 text-gray-600">
            <li><strong>View and Manage Orders:</strong> Easily toggle between viewing new, prepared, sent, and completed orders.</li>
            <li><strong>View Income Summary:</strong> Access a summary of income from various orders at a glance.</li>
            <li><strong>Upload Products:</strong> Add new products to the store.</li>
            <li><strong>Users List:</strong> View all registered users.</li>
            <li><strong>Customize Banners:</strong> Update the homepage banners to highlight promotions or new products.</li>
          </ul>
          <div className="mt-6">
            <p className="text-gray-600">Use the navigation menu to access these features. If you need any assistance, please reach out to support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAdmin;