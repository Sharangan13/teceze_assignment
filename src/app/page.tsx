"use client";

import { useState, useEffect, useCallback } from "react";
import EmployeeModal from "@/components/EmployeeModal";
import EmployeeTable from "@/components/EmployeeTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Employee, EmployeeFormData } from "@/types/employee";

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Generate next employee number
  const getNextEmployeeNo = () => {
    if (employees.length === 0) return "EMP001";
    const nums = employees
      .map((e) => parseInt(e.employee_no.replace(/\D/g, ""), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    return `EMP${String(max + 1).padStart(3, "0")}`;
  };

  // Add employee
  const handleAdd = async (data: EmployeeFormData) => {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to add employee");

    setEmployees((prev) => [...prev, result]);
  };

  // Edit employee
  const handleEdit = async (data: EmployeeFormData) => {
    if (!editingEmployee) return;

    const res = await fetch(`/api/employees/${editingEmployee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to update employee");

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editingEmployee.id ? result : emp))
    );
    setEditingEmployee(null);
  };

  // Delete employee
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/employees/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete");
      }
      setEmployees((prev) => prev.filter((emp) => emp.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">Employee Management</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Manage your team records</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "Loading..." : `${employees.length} total records`}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
            <button onClick={fetchEmployees} className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium underline">
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-36" />
                  <div className="h-4 bg-gray-200 rounded w-28" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            onEdit={openEditModal}
            onDelete={(emp) => setDeleteTarget(emp)}
          />
        )}
      </main>

      {/* Modals */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingEmployee ? handleEdit : handleAdd}
        employee={editingEmployee}
        nextEmployeeNo={getNextEmployeeNo()}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        employee={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
