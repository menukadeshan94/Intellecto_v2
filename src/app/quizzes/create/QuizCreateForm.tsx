// /app/quizzes/create/QuizCreateForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ICategoryForForm } from "../../../../types/types"; // More specific type for form

type QuizCreateFormProps = {
  categories: ICategoryForForm[];
  creatorId: string;
};

export default function QuizCreateForm({ categories, creatorId }: QuizCreateFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid .xlsx file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!file) {
      setError('Please upload an Excel file');
      setIsLoading(false);
      return;
    }

    if (!categoryId) {
      setError('Please select a category');
      setIsLoading(false);
      return;
    }

    // Create FormData to send file, categoryId, and creatorId
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categoryId', categoryId);
    formData.append('creatorId', creatorId);

    try {
      const response = await fetch('/api/quizzes/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload quiz');
      }

      const result = await response.json();
      alert('Quiz created successfully!'); // Temporary alert; replace with better UI feedback later
      // Reset form
      setFile(null);
      setCategoryId('');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || 'Error uploading quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Upload Excel File
        </label>
        <input
          type="file"
          id="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          aria-describedby="file-error"
        />
        <p className="mt-2 text-sm text-gray-500">
          Download the{' '}
          <Link href="/api/quizzes/template" className="text-blue-500 hover:underline">
            Excel template
          </Link>{' '}
          to ensure correct formatting.
        </p>
        {error.includes('file') && (
          <p id="file-error" className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          aria-describedby="category-error"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {error.includes('category') && (
          <p id="category-error" className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
          isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Uploading...' : 'Create Quiz'}
      </button>

      {error && !error.includes('file') && !error.includes('category') && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}