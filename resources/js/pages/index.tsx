import { User } from '@/types';
import { User as UserIcon, Pencil, Trash2, Search, ChevronDown } from 'lucide-react';
import  { useEffect, useState } from 'react';
import { Pagination } from '@/components/ui/pagination';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface Link {
    url: string | null;
    label: string;
    active: boolean;
}
interface Meta {
    from?: number;
    to?: number;
    total?: number;
}

export default function Index() {

    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>('');;
    const [links, setLinks] = useState<Link[]>([]);
    const [meta, setMeta] = useState<Meta>({});
    const [perPage, setPerPage] = useState<number>(25); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [bulkOption, setBulkOption] = useState<string>('select');
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<{ name: string; email: string }>({
        name: '',
        email: '',
    });

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  //Bulk Event
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (bulkOption == "select") return;
    if (bulkOption == "delete"){
      try {
        await axios.post(
          '/api/users/bulkDelete',
          { ids: selectedUsers },
          { withCredentials: true }
        );
        fetchUsers(); // Refresh user list
        setSelectedUsers([]); // Clear selected users
      } catch (error) {
        console.error('Bulk delete failed:', error);
      }
    }  
  };

  //Deleting User
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  //Update User
  const updateUser = async (id: number) => {
    try {
      await axios.put(`/api/users/${id}`, editForm, { withCredentials: true });
      fetchUsers();
      setUserToEdit(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  //Get Users Data
  const fetchUsers = async (url = '/api/users') => {
    setIsLoading(true);
    try {
      const params = {
        search,
        per_page: perPage,
      };
      const { data } = await axios.get(url, { params, withCredentials: true });
      setUsers(data.data);
      setLinks(data.links);
      setMeta(data || {});
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, perPage]);


  //Formatting Date
  const dateFormat = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="flex items-center justify-start px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        </div>
        
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Bulk Actions */}
          <div className="flex items-center">
            <div>
              <select
                onChange={(e) => setBulkOption(e.target.value)}
                className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  Bulk actions
                </option>
                <option value="select">Select</option>
                <option value="delete">Delete</option>
              </select>
            </div>
            <button
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              disabled={
                selectedUsers.length === 0 || bulkOption === '' || bulkOption === 'select'
              }
              onClick={() => {
                    if (window.confirm('Are you sure you want to delete the selected users?')) {
                      handleBulkDelete();
                    }
              }}
            >
              Apply
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Search users..."
              />
            </div>
            
            {/* Per Page Selector */}
            <div className="relative w-full sm:w-32">
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-gray-50 appearance-none"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">
                      <input type="checkbox" />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                      />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">                 
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.email_verified_at ? 'Verified' : 'Not Verified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dateFormat(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button className="text-blue-600 hover:text-blue-900 transition"
                        onClick={() => {
                          setUserToEdit(user);
                          setEditForm({ name: user.name, email: user.email });
                        }}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition"
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{meta.from || 0}</span> to{' '}
            <span className="font-medium">{meta.to ?? users.length}</span> of{' '}
            <span className="font-medium">{meta.total || 0}</span> results
        </div>
          <Pagination 
            links={links} 
            onPageChange={(url) => fetchUsers(url)}
            className="space-x-2"
          />
        </div>

        {userToDelete && (
          <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {userToDelete.name}? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="px-4 py-2 border rounded-lg">Cancel</button>
                </DialogClose>
                <DialogClose asChild>
                  <button
                    onClick={() => {
                      deleteUser(userToDelete.id);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Confirm Delete
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {userToEdit && (
          <Dialog open={!!userToEdit} onOpenChange={() => setUserToEdit(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Modify the user details below.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2"
                  placeholder="Email"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="px-4 py-2 border rounded-lg">Cancel</button>
                </DialogClose>
                <DialogClose asChild>
                  <button
                    onClick={() => updateUser(userToEdit.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
