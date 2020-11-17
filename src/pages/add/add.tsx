import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import './add.css';
import { BackendService, Ticket } from '../../backend';

interface AddProps {
  backend: BackendService;
}

type TicketAddForm = Omit<Ticket, 'id'>;

const Add = ({ backend }: AddProps) => {
  const [form, setTicketForm] = useState({
    description: '',
    completed: false,
    assigneeId: null,
  } as TicketAddForm);

  const [error, setErrorForm] = useState(null as Error | null);
  const [success, setSuccessForm] = useState(null as boolean | null);

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      if (form.description.trim() === '') {
        throw new Error('Description should not be empty');
      }

      await backend.newTicket(form).toPromise();
      setSuccessForm(true);
    } catch (e) {
      setErrorForm(e);
    }
  };

  return (
    <div className="add">
      <h2>Tickets</h2>
      {success && <p>Ticket "{form.description}" Added</p>}
      {error && <p>{error.message}</p>}
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Adding ticket</legend>
          <label htmlFor="description">
            Description
            <input
              type="text"
              id="description"
              value={form.description}
              aria-label="description"
              onChange={event => {
                setTicketForm(
                  field =>
                    ({
                      ...field,
                      description: event.target.value || '',
                    } as TicketAddForm),
                );
              }}
            />
          </label>
          <button type="submit" aria-label="submit">
            Add
          </button>
          <Link to="/">Go Home</Link>
        </fieldset>
      </form>
    </div>
  );
};

export default Add;
