// app/admin/categories/page.tsx
import { Toaster } from 'react-hot-toast';
import CategoryManager from '../../../../components/CategoryManager/CategoryManager';

export default function CategoriesPage() {
  return (
    <div className="max-h-screen  max-w-screen  bg-background">
      <CategoryManager />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}

// Alternatively, if you want to use it as a component in other pages
// app/components/CategoryManager.tsx - save the first artifact content here