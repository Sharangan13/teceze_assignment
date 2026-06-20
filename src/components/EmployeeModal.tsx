"use client";

import { useState, useEffect } from "react";
import { Employee, EmployeeFormData } from "@/types/employee";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  employee?: Employee | null;
  nextEmployeeNo: string;
}

export default function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  employee,
  nextEmployeeNo,
}: EmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employee_no: "",
    employee_name: "",
    designation: "",
    salary: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!employee;

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_no: employee.employee_no,
        employee_name: employee.employee_name,
        designation: employee.designation,
        salary: employee.salary,
      });
    } else {
      setFormData({
        employee_no: nextEmployeeNo,
        employee_name: "",
        designation: "",
        salary: 0,
      });
    }
    setError("");
  }, [employee, nextEmployeeNo, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.employee_name.trim()) {
      setError("Employee name is required");
      return;
    }
    if (!formData.designation.trim()) {
      setError("Designation is required");
      return;
    }
    if (!formData.salary || Number(formData.salary) <= 0) {
      setError("Salary must be a positive number");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <p className="text-blue-100 text-sm mt-0.5">
            {isEditing
              ? "Update the employee details below"
              : "Fill in the details to add a new employee"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Employee No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Employee No
            </label>
            <input
              type="text"
              readOnly
              value={formData.employee_no}
              onChange={(e) =>
                setFormData({ ...formData, employee_no: e.target.value })
              }
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
              placeholder="e.g. EMP001"
              required
            />
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.employee_name}
              onChange={(e) =>
                setFormData({ ...formData, employee_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              className="text-gray-800 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.salary || ""}
                onChange={(e) =>
                  setFormData({ ...formData, salary: parseFloat(e.target.value) })
                }
                className="text-gray-800 w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </span>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
