import React, { useEffect, useState } from "react";
import './App.css';
import { APIResponse, Ticket} from './models/data';
import axios from 'axios';
import { IoMdOptions } from 'react-icons/io';
import { RiArrowDownSLine } from 'react-icons/ri';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { GetPriorityIcon, GetPriorityLabel, GetStatusIcon } from "./components/func";
import { useMobileLayout } from "./components/hook";

// API base URL
const baseURL = "https://api.quicksell.co";

// Main App component
function App() {
  // Using custom hook to determine if the layout is mobile
  const isMobile = useMobileLayout();

  // State to store API data, groupBy, sortBy, and dropdown visibility
  const [apiData, setApiData] = useState<APIResponse | null>(null);
  const [groupBy, setGroupBy] = useState<string>(() => {
    return localStorage.getItem('group-by') || 'status';
  });
  const [sortBy, setSortBy] = useState<string>(() => {
    return localStorage.getItem('sort-by') || 'priority';
  });
  const [showDropdowns, setShowDropdowns] = useState(false);

  // Function to fetch data from the API
  async function fetchData() {
    try {
      const response = await axios.get<APIResponse>(`${baseURL}/v1/internal/frontend-assignment`);
      setApiData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // useEffect to save groupBy and sortBy to localStorage
  useEffect(() => {
    
    localStorage.setItem('group-by', groupBy);
    localStorage.setItem('sort-by', sortBy);
  }, [groupBy, sortBy]);

  // Function to get initials and avatar for a given userId
  const getInitialsAndAvatar = (userId: string): { initials: string; avatar: string } => {
    const user = apiData?.users.find(user => user.id === userId);
  
    if (user) {
      
      const initials = user.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();

      const avatar = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
  
      return { initials, avatar };
    }
  
    return { initials: '', avatar: '' };
  };
  
  // Function to render grouped tickets based on groupBy and sortBy
 const renderGroupedTickets = () => {
  if (!apiData) {
    return null;
  }

  // Define group labels based on groupBy
  let groupLabels: string[] = [];
  if (groupBy === 'status') {
    groupLabels = ['Backlog', 'Todo', 'In progress', 'Completed', 'Cancelled'];
  } else if (groupBy === 'user') {
    groupLabels = ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5'];
  } else if (groupBy === 'priority') {
    groupLabels = ['Urgent', 'High', 'Medium', 'Low', 'No priority'];
  }

  // Function to get user name based on user id
  const getName = (id:string): string => {
    if(apiData){
      switch (id) {
      case "usr-1":
        return apiData?.users[0].name;
      case "usr-2":
        return apiData?.users[1].name;
      case "usr-3":
        return apiData?.users[2].name;
      case "usr-4":
        return apiData?.users[3].name;
      case "usr-5":
        return apiData?.users[4].name;
      default:
        return '';
    }
    }
    else{
      return '';
    }
  };

  // Object to store tickets grouped by the selected criteria
  const groupedTickets: Record<string, Ticket[]> = {};
  apiData.tickets.forEach(ticket => {
    const groupKey = groupBy === 'status' ? ticket.status :
                    groupBy === 'user' ? ticket.userId :
                    groupBy === 'priority' ? GetPriorityLabel(ticket.priority) : '';
    if (!groupedTickets[groupKey]) {
      groupedTickets[groupKey] = [];
    }
    groupedTickets[groupKey].push(ticket);
  });

  // Sort the tickets within each group based on sortBy
  for (const key in groupedTickets) {
    if (sortBy === 'priority') {
      groupedTickets[key].sort((a, b) => b.priority - a.priority);
    } else if (sortBy === 'title') {
      groupedTickets[key].sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  // Render the grouped and sorted tickets in columns or rows based on isMobile
  return (
    <div style={{ display: 'flex', gap: '10px' , padding: '10px',flexDirection: isMobile ? 'column' : 'row'}}>
      {groupLabels.map(groupLabel => (
        <div key={groupLabel} className="group" style={{ flex: 1 }}>
          <h4>{groupBy === 'user' ? <div className="titlecol"><div className="user-avatar">
            <img src={getInitialsAndAvatar(groupLabel).avatar} alt="User Avatar" />
            </div>{getName(groupLabel)}</div> : ( groupBy === 'priority' ? <div className="titlecol"><div className="icons">{GetPriorityIcon(groupLabel)}</div>{groupLabel}</div>: (groupBy==='status'? <div className="titlecol"><div className="icons">{GetStatusIcon(groupLabel)}</div>{groupLabel}</div> :groupLabel))}</h4>
          <ul>
            {groupedTickets[groupLabel]?.map(ticket => (
              <li key={ticket.id}>
                <p className="ticid">{ticket.id}
                {groupBy === 'user' ? <></> : <div className="user-avatar">
                  <img src={getInitialsAndAvatar(ticket.userId).avatar} alt="User Avatar" />
                </div>}
                </p> 
                <div style={{display:'flex'}}><div style={{marginTop:'14px', marginRight:'10px'}}>{groupBy === 'status' ? <></> : GetStatusIcon(ticket.status)}</div><h3>{ticket.title}</h3></div>
                <div style={{display:'flex', marginLeft:'5px'}}><div style={{ marginRight:'10px'}} className={groupBy === 'priority' ? '' : 'boxed'}>{groupBy === 'priority' ? <></> : GetPriorityIcon(ticket.priority)}</div>
                {ticket.tag.map(item => (
                    <div className="boxed" style={{display:'flex',justifyItems:'center'}}><div style={{fontSize:'10px', fontWeight:'bold'}}>{item}</div></div>
                ))} </div><br />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Main component rendering
  return (
    <div>
      <div className="groupnsort">
        <button onClick={() => setShowDropdowns(!showDropdowns)}>
          <IoMdOptions className="icon1">  </IoMdOptions>
          {" "}Display{" "}
          {showDropdowns ? <RiArrowDownSLine className="icon2" /> : <MdKeyboardArrowUp className="icon2" />}
        </button>

        {showDropdowns && (
          <div className="dropdown-container">
            <div>
              <label htmlFor="groupBy">{" "}Grouping{" "}</label>
              <select id="groupBy" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div>
              <label htmlFor="sortBy">{" "}Ordering{" "}</label>
              <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
      {renderGroupedTickets()}
    </div>
  );
}

export default App;
