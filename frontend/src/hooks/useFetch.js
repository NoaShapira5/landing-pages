import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        axios.post(url).then((res) => {
            setData(res.data)
            setError(res.Errors)
            setLoading(false)
        })
    }, [url]);
    
    return { data, loading, error };
}


export default useFetch;