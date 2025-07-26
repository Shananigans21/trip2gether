import { use, useEffect, useState } from 'react';
import { fetchHotelsInCity } from '../services/travel';

function HotelsPage() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchHotelsInCity('New York')
            .then(data => {
                setResults(data.data || []);
            })
            .catch(err => {
                console.error('Error fetching hotels:', err);
            });
    }, []); 
    return (
        <div>
            <h2>Hotels in New York</h2>
            <ul>
                {results.map(hotel => (
                    <li key={hotel.location_id}>
                        {ClipboardItem.result_object.name}
                        </li>
                ))}
            </ul>
            

            
        </div>
    )
}