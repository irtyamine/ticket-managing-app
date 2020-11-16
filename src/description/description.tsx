import React, { Fragment, useEffect, useState } from 'react';
import './description.css';
import { BackendService, Ticket } from '../backend';
import { Link } from 'react-router-dom';

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
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [backend, id]);

  if (!error && !ticket) {
    return <p>...Loading ticket information</p>;
  }

  if (error) {
    return (
      <Fragment>
        <h2 data-testid="title">Ticket</h2>
        <p>We couldn't find the ticket with id "{id}"</p>
      </Fragment>
    );
  }

  return (
    <div className="description">
      {ticket ? (
        <Fragment>
          <h2 data-testid="title">Ticket</h2>
          <p>{ticket.description}</p>
          <Link to="/">Go Home</Link>
        </Fragment>
      ) : (
        <span>...</span>
      )}
    </div>
  );
};

export default Description;
