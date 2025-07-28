'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // Ensure this is installed: npm install react-hot-toast
import { ICategory, IQuiz } from '../../types/types'; // Adjusted import

interface CategoryFormData {
  name: string;
  description: string;
  image?: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Fetch categories on mount with cleanup
  useEffect(() => {
    fetchCategories();
    return () => {}; // Cleanup (optional if needed for aborting fetch)
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const { message } = await response.json();
        toast.error(message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkCategoryExists = (name: string, excludeId?: string): boolean => {
    return categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== excludeId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Name and description are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = editingCategoryId
        ? `/api/categories/${editingCategoryId}`
        : '/api/categories';
      const method = editingCategoryId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          image: formData.image?.trim() || undefined,
        }),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        if (editingCategoryId) {
          setCategories((prev) =>
            prev.map((cat) => (cat.id === editingCategoryId ? updatedCategory : cat))
          );
          toast.success('Category updated successfully');
        } else {
          setCategories((prev) => [...prev, updatedCategory]);
          toast.success('Category created successfully');
        }
        setFormData({ name: '', description: '', image: '' });
        setEditingCategoryId(null);
      } else {
        const { message } = await response.json();
        toast.error(message || (editingCategoryId ? 'Failed to update category' : 'Failed to create category'));
        if (response.status === 409) {
          toast.error('Category name already exists');
        }
      }
    } catch (error) {
      console.error(`Error ${editingCategoryId ? 'updating' : 'creating'} category:`, error);
      toast.error(`Error ${editingCategoryId ? 'updating' : 'creating'} category`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((category) => category.id !== id));
        toast.success('Category deleted successfully');
      } else {
        const { message } = await response.json();
        toast.error(message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  const handleEdit = (category: ICategory) => {
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image || '',
    });
    setEditingCategoryId(category.id);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
        Category Manager
      </h1>

      {/* Create/Edit Category Form */}
      <div className="mb-8 p-6 bg-card rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {editingCategoryId ? 'Edit Category' : 'Create New Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter category description"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-muted-foreground mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? editingCategoryId ? 'Updating...' : 'Creating...'
                : editingCategoryId ? 'Update Category' : 'Create Category'}
            </button>
            {editingCategoryId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ name: '', description: '', image: '' });
                  setEditingCategoryId(null);
                }}
                className="flex-1 bg-muted text-muted-foreground py-2 px-4 rounded-md hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search Categories */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-2">
          Search Categories
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Search by name or description..."
        />
      </div>

      {/* Categories List */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Existing Categories ({filteredCategories.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="mt-2 text-muted-foreground">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-card border border-muted rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {category.image && (
                  <div className="mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium text-foreground truncate">
                    {category.name}
                  </h3>
                  <div className="space-x-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-primary hover:text-primary/80 p-2 rounded-full hover:bg-primary/10 transition-colors"
                      title="Edit category"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L19.5 7.5l-1.414 1.414-2.828-2.828 1.414-1.414z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-destructive hover:text-destructive/80 p-2 rounded-full hover:bg-destructive/10 transition-colors"
                      title="Delete category"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-base text-muted-foreground mb-4 line-clamp-3">
                  {category.description}
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <span>Quizzes: {category.quizzes.length}</span>
                  <span>ID: {category.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}