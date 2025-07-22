import axios from 'axios';
import { useEffect, useState } from 'react';

const useCategories = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const getCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false); // Make sure to set loading to false even on error
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return { loading, categories, getCategories }; // Also return getCategories in case you need to refetch
};

export default useCategories;