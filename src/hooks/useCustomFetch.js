import { useCallback, useEffect, useState } from "react";

function useCustomFetch(page){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [gitData, setGitData] = useState([]);

    const fetchApiData = useCallback(async () => {
    try {
        await setLoading(true);
        await setError(false);
        const res = await fetch(`https://api.github.com/repos/facebook/react/issues?page=${page}&per_page=50`,{
            headers: {
                'Authorization': 'token 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'
            }
        });
        const data = await res.json();
        await setGitData((prev) => [...new Set([...prev, ...data])]);
        setLoading(false)} catch (err) {
        setError(err)}
    }, [page]);

    useEffect(() => {
        fetchApiData(page);
    }, [page]);
    
    return { loading, error, gitData };

}
export default useCustomFetch;