'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { isAdmin } from '@/lib/adminAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LocationsPage() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [featuredCities, setFeaturedCities] = useState([]);
  const [popularCities, setPopularCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    imageUrl: '',
  });

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/admin/locations');
      setFeaturedCities(res.data.featured);
      setPopularCities(res.data.popular);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (!isAdmin(user)) {
      router.push('/');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchLocations();
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCity) {
        await axios.put('/api/admin/locations', { id: editingCity._id, ...formData });
        toast.success('City updated successfully');
      } else {
        await axios.post('/api/admin/locations', formData);
        toast.success('City added successfully');
      }
      setShowAddModal(false);
      setEditingCity(null);
      setFormData({ name: '', country: '', description: '', imageUrl: '' });
      fetchLocations();
    } catch (error) {
      console.error('Error saving city:', error);
      toast.error('Failed to save city');
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      country: city.country,
      description: city.description || '',
      imageUrl: city.imageUrl || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this city?')) return;
    
    try {
      await axios.delete(`/api/admin/locations?id=${id}`);
      toast.success('City deleted successfully');
      fetchLocations();
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Failed to delete city');
    }
  };

  const toggleActive = async (city) => {
    try {
      await axios.put('/api/admin/locations', {
        id: city._id,
        isActive: !city.isActive,
      });
      toast.success(`City ${!city.isActive ? 'activated' : 'deactivated'}`);
      fetchLocations();
    } catch (error) {
      console.error('Error toggling city:', error);
      toast.error('Failed to update city');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Location Management</h1>
        <button
          onClick={() => {
            setEditingCity(null);
            setFormData({ name: '', country: '', description: '', imageUrl: '' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Featured City
        </button>
      </div>

      {/* Featured Cities */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Featured Cities</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {featuredCities.map(city => (
                <tr key={city._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{city.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{city.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{city.description?.substring(0, 50) || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${city.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {city.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => toggleActive(city)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {city.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(city)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(city._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {featuredCities.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No featured cities yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Cities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Popular Cities (By User Saves)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularCities.map((city, idx) => (
            <div key={idx} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{city.name}</h3>
                <p className="text-sm text-gray-600">{city.count} saves</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">#{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {editingCity ? 'Edit City' : 'Add Featured City'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">City Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCity(null);
                    setFormData({ name: '', country: '', description: '', imageUrl: '' });
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCity ? 'Update' : 'Add City'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
