"use client";

import { Employee } from "@/types/employee";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  employee,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        {/* Icon */}
        <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Employee</h3>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700">{employee.employee_name}</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
