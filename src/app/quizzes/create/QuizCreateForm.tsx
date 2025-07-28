// /app/quizzes/create/QuizCreateForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ICategoryForForm } from "../../../../types/types";

type QuizCreateFormProps = {
  categories: ICategoryForForm[];
  creatorId: string;
};

export default function QuizCreateForm({ categories, creatorId }: QuizCreateFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [success, setSuccess] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setError('');
      setSuccess('');
    } else {
      setFile(null);
      setError('Please upload a valid .xlsx file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(droppedFile);
      setError('');
      setSuccess('');
    } else {
      setError('Please upload a valid .xlsx file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    setUploadProgress(0);

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
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/quizzes/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload quiz');
      }

      const result = await response.json();
      setSuccess(`Successfully created ${result.quizzes?.length || 1} quiz(es)!`);
      
      // Reset form
      setFile(null);
      setCategoryId('');
      setUploadProgress(0);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || 'Error uploading quiz. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-chart-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-chart-4">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-destructive mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Upload Excel File
          </label>
          
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              file 
                ? 'border-chart-4 bg-chart-4/5' 
                : 'border-border hover:border-primary/50 bg-muted/20'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />
            
            <div className="text-center">
              {file ? (
                <div className="space-y-2">
                  <svg className="w-12 h-12 text-chart-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <svg className="w-12 h-12 text-muted-foreground mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Drag and drop your Excel file here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse (.xlsx files only)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Download */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Need the template?
                </p>
                <Link 
                  href="/api/quizzes/template" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Download Excel template →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label htmlFor="category" className="block text-sm font-medium text-foreground">
            Select Category
          </label>
          
          <div className="relative">
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground appearance-none pr-10"
              disabled={isLoading}
            >
              <option value="">Choose a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Category Preview */}
          {selectedCategory && (
            <div className="p-3 bg-accent/50 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedCategory.name}
                  </p>
                  {selectedCategory.description && (
                    <p className="text-xs text-muted-foreground">
                      {selectedCategory.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="text-muted-foreground">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !file || !categoryId}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            isLoading || !file || !categoryId
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-98'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Creating Quiz...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Quiz</span>
            </div>
          )}
        </button>

        {/* Form Info */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Before uploading:</p>
              <ul className="space-y-1">
                <li>• Ensure your Excel file follows the template format</li>
                <li>• Questions with the same title will be grouped into one quiz</li>
                <li>• All required fields must be filled</li>
                <li>• File size should be under 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}