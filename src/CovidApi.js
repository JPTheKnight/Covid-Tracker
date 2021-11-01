const ApiKey = '841f38433c99461aa1ea873df6768d46';

export async function fetchApiData() {

    const fetchData = await fetch(`https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${ApiKey}`);
    const data = await fetchData.json();
    return data;
}

