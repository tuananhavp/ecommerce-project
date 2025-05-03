"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";

import { FieldValue, Timestamp } from "firebase/firestore";
import { FaExclamationTriangle, FaEnvelope, FaPhone, FaSearch, FaSpinner, FaUserAlt } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";

import Loading from "@/components/Loading";
import { useUserStore } from "@/store/userStore";

const UsersManagement = () => {
  const { users, isLoading, error, pagination, fetchUsers, fetchMoreUsers, searchUsers, resetFilters } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");

  // Filter to show only customers
  const customerUsers = users.filter((user) => user.role === "customer");

  // Initial fetch of users
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers(searchTerm);
  };

  const formatDate = (timestamp: Timestamp | Date | FieldValue | null | undefined) => {
    if (!timestamp) return "N/A";

    try {
      if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      return "N/A";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Check if we have an error to display
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="alert alert-error">
          <div className="flex-1">
            <FaExclamationTriangle className="mr-2" />
            <span>Error loading users: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Customer Management</h2>
        <div className="stats bg-purple-50 border border-purple-100">
          <div className="stat">
            <div className="stat-title">Total Customers</div>
            <div className="stat-value text-purple-600">{customerUsers.length}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search Customers</label>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search by username or email..."
            className="input input-bordered w-full pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Clear Filters */}
      <div className="flex justify-start items-center mb-4">
        <button onClick={() => resetFilters()} className="btn btn-sm btn-outline" disabled={isLoading}>
          Clear Search
        </button>
      </div>

      {/* Users Table */}
      {isLoading && customerUsers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : customerUsers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <HiOutlineUserGroup className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search to find what you are looking for.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-100">
                <th>Customer</th>
                <th>Contact</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customerUsers.map((user) => (
                <tr key={user.id} className="hover">
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-200">
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.username || "User"} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-purple-100 text-purple-600">
                              <FaUserAlt />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{user.username || "No Name"}</div>
                        <div className="text-sm opacity-50">{user.id && `ID: ${user.id.substring(0, 8)}...`}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="flex items-center text-xs text-gray-600 mb-1">
                        <FaEnvelope className="mr-1" /> {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center text-xs text-gray-600">
                          <FaPhone className="mr-1" /> {user.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Load More Button */}
      {pagination.hasMore && (
        <div className="flex justify-center mt-6">
          <button onClick={() => fetchMoreUsers()} className="btn btn-outline" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
