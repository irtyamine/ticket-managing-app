import React, { useEffect, useState } from 'react';
import './description.css';
import { Link } from 'react-router-dom';
import { BackendService, Ticket } from '../../backend';

interface DescriptionProps {
  backend: BackendService;
  id: number;
}

const Description = ({ backend, id }: DescriptionProps) => {
  const [ticket, setTicket] = useState(null as Ticket | null);
  const [error, setError] = useState(null as Error | null);

  // The backend returns observables, but you can convert to promises if
  // that is easier to work with. It's up to you.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await backend.ticket(id).toPromise();
        setTicket(result);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
  }, [backend, id]);

  if (!error && !ticket) {
    return <p>...Loading ticket information</p>;
  }

  if (error) {
    return (
      <>
        <h2 data-testid="title">Ticket</h2>
        <p>We couldn't find the ticket with id "{id}"</p>
      </>
    );
  }

  return (
    <div className="description">
      {ticket ? (
        <>
          <h2 data-testid="title">Ticket</h2>
          <p>{ticket.description}</p>
          <Link to="/">Go Home</Link>
        </>
      ) : (
        <span>...</span>
      )}
    </div>
  );
};

export default Description;
