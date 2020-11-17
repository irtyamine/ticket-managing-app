import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './app.css';
import { BackendService, Ticket } from '../backend';

interface AppProps {
  backend: BackendService;
}

type TicketFormData = {
  filter: string;
  isChecked: boolean;
};

const App = ({ backend }: AppProps) => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [form, setTicketForm] = useState({ filter: '', isChecked: false } as TicketFormData);
  const [error, setError] = useState(null as Error | null);

  // The backend returns observables, but you can convert to promises if
  // that is easier to work with. It's up to you.
  useEffect(() => {
    try {
      const fetchData = async () => {
        const result = await backend.tickets().toPromise();
        setTickets(result);
      };
      fetchData();
    } catch (e) {
      setError(e);
    }
  }, [backend]);

  let Content;

  if (error) {
    Content = <p>Error message</p>;
  } else {
    Content =
      tickets.length > 0 ? (
        <>
          <ul data-testid="tickets">
            {tickets
              .filter(
                t => t.description.toLowerCase().includes(form.filter.toLowerCase()) && t.completed === form.isChecked,
              )
              .map(t => (
                <li key={t.id}>
                  <Link to={`/details/${t.id}`}>
                    Ticket: {t.id}, {t.description}
                  </Link>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <p>No tickets</p>
      );
  }

  return (
    <div className="app">
      <h2>Tickets</h2>

      <form>
        <fieldset>
          <legend>Filters</legend>
          <label htmlFor="filter">
            Description
            <input
              type="text"
              name="filter"
              id="completed"
              value={form.filter}
              aria-label="filter"
              onChange={event => {
                setTicketForm(
                  field =>
                    ({
                      ...field,
                      filter: event.target.value || '',
                    } as TicketFormData),
                );
              }}
            />
          </label>
          <label htmlFor="completed">
            Completed tasks?
            <input
              type="checkbox"
              id="completed"
              checked={form.isChecked}
              onChange={() => {
                setTicketForm(
                  field =>
                    ({
                      ...field,
                      isChecked: !field.isChecked,
                    } as TicketFormData),
                );
              }}
            />
          </label>
          <Link to="/add">Add</Link>
        </fieldset>
      </form>
      {Content}
    </div>
  );
};

export default App;
