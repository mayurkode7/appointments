import { useEffect, useCallback, useState } from 'react';
import { BiCalendar } from "react-icons/bi";
import Search from './components/Search'
import AddAppointment from "./components/AddAppointment";

// import appointmentList from './data.json'
import AppointmentInfo from "./components/AppointmentInfo";

function App() {

  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState('')

  const [sortBy, setSortBy] = useState('petName')
  const [orderBy, setOrderBy] = useState('asc')


  let filteredAppointmentList = appointmentList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ?
        -1 * order : 1 * order
    )
  })


  const onQueryChange = (myQuery) => {
    setQuery(myQuery)
  }

  const onDeleteAppointment = (appointmentID) => {
    let newAppointmentList = appointmentList.filter(appointment => appointment.id !== appointmentID)
    setAppointmentList(newAppointmentList)
  }

  const onAddNewAppointment = (newAppointment) => {
    console.log(newAppointment)
    setAppointmentList([...appointmentList, newAppointment])
  }

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      });

  }, []);

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3"> <BiCalendar className="inline-block text-red-400 align-top" />Your Appointments</h1>
      <AddAppointment onAddNewAppointment={onAddNewAppointment} />
      <Search query={query} onQueryChange={onQueryChange}
        orderBy={orderBy}
        onOrderByChange={(myOrder) => setOrderBy(myOrder)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)} />

      <ul className="divide-y divide-gray-200">
        {
          filteredAppointmentList.map(appointment => (
            <AppointmentInfo key={appointment.id} appointment={appointment} onDeleteAppointment={onDeleteAppointment} />
          ))
        }
      </ul>
    </div>

  );
}

export default App;
