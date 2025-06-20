import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./navbar.css";
import AddActivity from "./components/AddActivity";
import AddCategory from "./components/AddCategory";

function Navbar({ selectedDate, setSelectedDate, totalHours }) {
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">

        <div className="top-row d-flex align-items-center">
          <img src="/logo192.png" alt="logo MOVE!" className="logo" />

          <div className="month-picker">
            <Form.Group controlId="monthPicker">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  console.log("Vybraný měsíc v DatePickeru:", date);
                  setSelectedDate(date);
                }}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                className="form-control"
              />
            </Form.Group>
          </div>
        </div>

        <div className="button-row">
          <button
            className="action-button"
            onClick={() => setShowCategoryForm(true)}
          >
            new category
          </button>
          <button
            className="action-button"
            onClick={() => setShowActivityForm(!showActivityForm)}
          >
            new activity
          </button>
        </div>

        <div className="circle">{totalHours}h</div>

        {/* Modály */}
        <Modal show={showActivityForm} onHide={() => setShowActivityForm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Přidat aktivitu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddActivity
              onActivityAdded={(newActivity) => {
                console.log("Nová aktivita přidána:", newActivity);
                if (newActivity?.date) {
                  const newDate = new Date(newActivity.date);
                  console.log("Nastavuji selectedDate na:", newDate);
                  setSelectedDate(newDate);
                }
                setShowActivityForm(false);
              }}
            />
          </Modal.Body>
        </Modal>

        <Modal show={showCategoryForm} onHide={() => setShowCategoryForm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Přidat kategorii</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddCategory
              onCategoryAdded={() => setShowCategoryForm(false)}
            />
          </Modal.Body>
        </Modal>

      </div>
    </nav>
  );
}

export default Navbar;
