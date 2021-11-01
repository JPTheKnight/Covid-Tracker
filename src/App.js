import './App.css';
import BarChart from './Components/BarChart';
import moment from 'moment';
import { fetchApiData } from './CovidApi';
import { useEffect, useState } from 'react';

import loadingIcon from '../src/Images/Spinner.svg';

import MapChart from './Map/MapChart';
import ReactTooltip from "react-tooltip";

function App() {

  const [apiData, setApiData] = useState([]);
  const [data, setData] = useState();
  const [deathData, setDeathData] = useState();
  const [vaccineData, setVaccineData] = useState();
  const [date, setDate] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lastDay, setLastDay] = useState('');
  const [cases, setCases] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [vaccines, setVaccines] = useState(0);
  const [newCases, setNewCases] = useState(0);
  const [newDeaths, setNewDeaths] = useState(0);

  const [content, setContent] = useState("Lebanon - 4M");

  if (loading)
  {
    fetchApiData().then((_data) => {
      setApiData(_data);
      var m = new Date();
      var dateNowString = m.getUTCFullYear() + "/" +
      ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
      ("0" + m.getUTCDate()).slice(-2);
      setLastDay(dateNowString);
    });
  }

  const getDaysBetweenDates = (startDate, endDate) => {
      var now = startDate.clone(), dates = [];

      while (now.isSameOrBefore(endDate)) {
          dates.push(now.format('YYYY-MM-DD'));
          now.add(1, 'days');
     }
      return dates;
  };

  const getData = () => {
    var arr = [];
    for (let i=0;i<apiData.length;i++)
    {
      if (arr[0] === undefined)
        arr[0] = 0;
      arr[0] += (apiData[i].actualsTimeseries[0].cases == null) ? 0 : apiData[i].actualsTimeseries[0].cases;
      for (let j=1;j<apiData[i].actualsTimeseries.length;j++)
      {
        if (arr[j] === undefined)
          arr[j] = 0;
        arr[j] += (apiData[i].actualsTimeseries[j].cases == null) ? 0 : apiData[i].actualsTimeseries[j].cases - apiData[i].actualsTimeseries[j-1].cases;
      }
    }
    var arr1 = Array(Math.floor(arr.length / 7)).fill(0);
    let j = 0;
    for (let i=0;i<arr.length;i+=7)
    {
      for (let k=0;k<7;k++)
      {
        if (arr[k]!==undefined)
        {
          arr1[j] += arr[i+k];
        }
      }
      j++;
    }
    return arr1;
  }

  const getDeathData = () => {
    var arr = [];
    for (let i=0;i<apiData.length;i++)
    {
      if (arr[0] === undefined)
        arr[0] = 0;
      arr[0] += (apiData[i].actualsTimeseries[0].deaths == null) ? 0 : apiData[i].actualsTimeseries[0].deaths;
      for (let j=1;j<apiData[i].actualsTimeseries.length;j++)
      {
        if (arr[j] === undefined)
          arr[j] = 0;
        arr[j] += (apiData[i].actualsTimeseries[j].deaths == null) ? 0 : apiData[i].actualsTimeseries[j].deaths - apiData[i].actualsTimeseries[j-1].deaths;
      }
    }
    var arr1 = Array(Math.floor(arr.length / 7)).fill(0);
    let j = 0;
    for (let i=0;i<arr.length;i+=7)
    {
      for (let k=0;k<7;k++)
      {
        if (arr[k]!==undefined)
        {
          arr1[j] += arr[i+k];
        }
      }
      j++;
    }
    return arr1;
  }

  const getVaccineData = () => {
    var arr = [];
    for (let i=0;i<apiData.length;i++)
    {
      if (arr[0] === undefined)
        arr[0] = 0;
      arr[0] += (apiData[i].actualsTimeseries[0].vaccinationsCompleted == null) ? 0 : apiData[i].actualsTimeseries[0].vaccinationsCompleted;
      for (let j=1;j<apiData[i].actualsTimeseries.length;j++)
      {
        if (arr[j] === undefined)
          arr[j] = 0;
        arr[j] += (apiData[i].actualsTimeseries[j].vaccinationsCompleted == null) ? 0 : apiData[i].actualsTimeseries[j].vaccinationsCompleted - apiData[i].actualsTimeseries[j-1].vaccinationsCompleted;
      }
    }
    var arr1 = Array(Math.floor(arr.length / 7)).fill(0);
    let j = 0;
    for (let i=0;i<arr.length;i+=7)
    {
      for (let k=0;k<7;k++)
      {
        if (arr[k]!==undefined)
        {
          arr1[j] += arr[i+k];
        }
      }
      j++;
    }
    return arr1;
  }

  const getDate = () => {
    console.log(apiData);
    var _date = new Date(apiData[0].actualsTimeseries[0].date);

    for (let i=0;i<apiData.length;i++)
    {
      for (let j=1;j<apiData[i].actualsTimeseries.length;j++)
      {
        var __date = new Date(apiData[i].actualsTimeseries[j].date);
        if (_date > __date)
        {
          _date = __date;
        }
      }
    }

    var dateString =
    _date.getUTCFullYear() + "-" +
    ("0" + (_date.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + _date.getUTCDate()).slice(-2);

    var m = new Date();
    var dateNowString = m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

    var startDate = moment(dateString);
    var endDate = moment(dateNowString);

    var dateList = getDaysBetweenDates(startDate, endDate);
    var dateList1 = [];
    let j=0;

    for(let i=-7;i<dateList.length;i+=7)
    {
      if (dateList[i+7]!==undefined)
      {
        dateList1[j] = dateList[i+7];
        j++;
      }
    }

    return dateList1;
  }

  const getCases = () => {
    var arr = 0;
    for (let i=0;i<apiData.length;i++)
    {
      arr += apiData[i].actuals.cases;
    }
    return arr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getDeaths = () => {
    var arr = 0;
    for (let i=0;i<apiData.length;i++)
    {
      arr += apiData[i].actuals.deaths;
    }
    return arr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getVaccines = () => {
    var arr = 0;
    for (let i=0;i<apiData.length;i++)
    {
      arr += apiData[i].actuals.vaccinationsCompleted;
    }
    return arr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getNewCases = () => {
    var arr = 0;
    for (let i=0;i<apiData.length;i++)
    {
      arr += apiData[i].actuals.newCases;
    }
    return arr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getNewDeaths = () => {
    var arr = 0;
    for (let i=0;i<apiData.length;i++)
    {
      arr += apiData[i].actuals.newDeaths;
    }
    return arr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    if (date.length > 0)
      setLoading(false);
  }, [date]);

  useEffect(() => {
    if (loading && apiData.length > 0)
    {
      setTimeout(() => {
        setData(getData());
        setDeathData(getDeathData());
        setVaccineData(getVaccineData());
        setDate(getDate());
        setCases(getCases());
        setDeaths(getDeaths());
        setVaccines(getVaccines());
        setNewCases(getNewCases());
        setNewDeaths(getNewDeaths());
      }, 2000);
    }
  }, [apiData]);

  useEffect(() => {
    for (let i = 0; i < apiData.length; i++) {
      if (content === apiData[i].state)
      {
        setContent(content + ' - New C: ' + apiData[i].newCases + ' New D: ' + apiData[i].newDeaths);
      }     
    }
  }, [content])

  return (
    <div class="App">
      <ReactTooltip>{content}</ReactTooltip>
      <div class='header'>
        Holy shit
      </div>
      <div class='cells'>
        <div class='first-col'>
          <div class='cell'>
            <div>
              <p>Last Updated at (M/D/YYYY)</p>
              <p>{lastDay}</p>
            </div>
          </div>
          <div class='cell'>
            <div>
              <p>Cases | Deaths by</p>
              <p>States</p>
            </div>
            <div class='data-container'>
              {
                apiData?.map((el, i) => {
                  return <div class='data'> 
                    <div class='state'>{el.state}</div>
                    <div class='cases'>CASES: {el.actuals.newCases} | DEATHS: {el.actuals.newDeaths}</div>
                    <div class='vaccines'>TOTAL VACCINES: {el.actuals.vaccinationsCompleted}</div>
                    <hr/>
                  </div>
                })
              }
            </div>
          </div>
        </div>
        <div class='scnd-col'>
          <div class='cells'>
            <div class='cell'>
              <div>
                <p>Total Cases</p>
                <p>{cases}</p>
              </div>
            </div>
            <div class='cell'>
              <div>
                <p>Total Deaths</p>
                <p>{deaths}</p>
              </div>
            </div>    
            <div class='cell'>
              <div>
                <p>Total Vaccine Doses Administered</p>
                <p>{vaccines}</p>
              </div>
            </div>
            <div class='cell'>
              <div>
                <p>New Cases</p>
                <p>{newCases}</p>
              </div>
            </div>
            <div class='cell'>
              <div>
                <p>New Deaths</p>
                <p>{newDeaths}</p>
              </div>
            </div>
            <div class='cell'>
              <div>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
          <div class='scnd-col-scnd-row'>
            <MapChart setTooltipContent={setContent} />
          </div>
        </div>
        <div class='third-col'>
          <div class='cell'>
            <div class='third-col-body'>
              {loading && <div class='loadings'>
                  <div class='img-container'><img src={loadingIcon} alt='' class='img'/></div>
                </div>}
              {!loading && <div>
                <BarChart name='Weekly Cases' color='255, 0, 0' data={data} labels={date}/>
                <BarChart name='Weekly Deaths' color='255, 255, 255' data={deathData} labels={date}/>
                <BarChart name='Weekly Doses' color='0, 255, 0' data={vaccineData} labels={date}/>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
