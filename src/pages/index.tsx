import React, { useState, ChangeEvent } from 'react';
import parseCsv from 'papaparse';
import priceUpdate from '../hooks/hooks';

const HomePage = () => {

    const [initialSet, setSelection] = useState('xln')
    const [initialTCGFile, setTCGFile] = useState([{}])
    const [initialScryFile, setScryFile] = useState([{}])


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelection(event.target.value);
        console.log(event.target.value);
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        let result = new Promise<{}[]>((resolve) => {
            parseCsv.parse(event.target.files![0], {
                header: true,
                skipEmptyLines: "greedy",
                transformHeader: (header) => {
                    return header.toLowerCase().trim()
                },
                complete: (results: { data: {}[] }) => {
                    console.log(results.data)
                    name === 'TCG' ? setTCGFile(results.data) : setScryFile(results.data)
                    return resolve(results.data)
                }
            })
        });

        return result;
    }

    const handleUpdate = async () => {
        await priceUpdate(initialTCGFile, initialScryFile, initialSet)
            .then((data) => {
                console.log(data) //Latest Price Data
            });
    }

    return (
        <div>
            Please select a set (to lower case):
            <input type="text" value={initialSet} onChange={handleChange} />
            <p>You can upload TCG Pricing files here: (According to the set)</p>
            <input type="file" name="TCG" onChange={handleFileChange} />
            <p>You can upload Scryfall Pricing files here: (According to the set)</p>
            <input type="file" name="Scry" onChange={handleFileChange} />

            {/* <p>{JSON.stringify(initialScryFile)}</p>
            <p>{JSON.stringify(initialTCGFile)}</p> */}
            <button onClick={handleUpdate}>Update</button>
        </div >
    )
}

export default React.memo(HomePage);