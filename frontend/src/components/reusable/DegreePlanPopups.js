/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreePlanPopups.js
 *
 *
 */

import { useEffect, useState } from 'react';
import {
  Button,
  InputAdornment,
  TextField,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import pStyle from '../reusable/reusableStyles/Popup.module.css';
import Popup from './Popup';
import PlanCard from './PlanCard';
import Dropdown from './Dropdown';
import CourseSearchBar from './CourseSearchBar';
import SnackBarAlert from './SnackBarAlert';
import DegreeReqDisplay from './DegreeReqDisplay';
import JarUserLogin from './JarUserLogin';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                          Add PlanCard Popup                               *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// const yearOptions = []
const termOptions = ['Fall', 'Spring', 'Summer', 'Annual'];
function AddSemester(props) {
  const {
    onClose,
    planName,
    planID,
    cardOptions,
    refreshPlans,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity,
  } = props;

  /* Year Dropdown */
  const [yearOptions, setYearOptions] = useState([
    2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
  ]); // will be replaced by API?!
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);
  const [selectedYearIdx, setSelectedYearIdx] = useState(0);
  /* Term Dropdown */

  const [selectedTerm, setSelectedTerm] = useState(termOptions[0]);
  const [selectedTermIdx, setSelectedTermIdx] = useState(0);

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
    setSelectedTermIdx(e.target.selectedIndex);
  };

  const handleYearChange = (e) => {
    setSelectedYearIdx(e.target.selectedIndex);
    setSelectedYear(e.target.value);
  };

  const validateAdd = () => {
    var res = true;
    cardOptions.forEach((card) => {
      const time = card?.term.split(' ');

      console.log('true? ', time[0] === '' + yearOptions[selectedYearIdx]);

      if (
        time[0] === '' + yearOptions[selectedYearIdx] &&
        time[1] === '' + termOptions[selectedTermIdx]
      ) {
        res = false;
      }
    });

    return res;
  };

  const handleAdd = () => {
    /* do something API??  */

    if (validateAdd() === true) {
      fetchAdd();
    } else {
      setAlertMessage('term already exists!');
      setAlertSeverity('warning');
      onShowAlert(true);
    }
  };

  const fetchAdd = async () => {
    const yearTerm =
      yearOptions[selectedYearIdx] + ' ' + termOptions[selectedTermIdx];

    const value = { plan_id: planID, term: yearTerm };
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    };

    await fetch('https://qa.jarney.club/api/degreeplan/term', requestOption)
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          refreshPlans();
          setAlertMessage('Term added!');
          setAlertSeverity('success');
          onShowAlert();
          onClose();
        } else {
          setAlertMessage(result.error);
          setAlertSeverity('warning');
          onShowAlert(true);
        }
      })
      .catch((error) => {});
  };
  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton
          type="button"
          onClick={onClose}
          className={pStyle.closeButton}
        >
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>
          Add Card to {planName}&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.dropdownContainer}>
          <Dropdown
            options={termOptions}
            selectedOption={selectedTerm}
            onOptionChange={handleTermChange}
          />
          <Dropdown
            options={yearOptions}
            selectedOption={selectedYear}
            onOptionChange={handleYearChange}
          />
        </div>

        <Button className={pStyle.submitButton} onClick={handleAdd}>
          ADD
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                            Remove PlanCard Popup                          *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function RemoveSemester(props) {
  const {
    onClose,
    cardOptions,
    planName,
    planID,
    refreshPlans,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity,
  } = props;
  /*  Stores the cards to be deleted  */
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardChange = (e) => {
    const val = e.target.id;
    const pos = selectedCards.indexOf(val);
    if (pos === -1) {
      /* was not in selectedCards array, aka was not selected, now select */
      setSelectedCards((prev) => prev.concat(val));
      e.target.style.backgroundColor = '#5A32BF';
      e.target.style.color = '#ffffff';
    } else {
      /* found in selectedCards array, aka was selected, now unselect */
      setSelectedCards((prev) => prev.filter((card) => card !== val));
      e.target.style.backgroundColor = '#ffffff';
      e.target.style.color = '#5A32BF';
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    /* do something API?? pass in the selectedCards arr */

    fetchDeleteTerms();
  };

  const fetchDeleteTerms = async () => {
    const requestOption = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_term_ids: selectedCards,
        plan_id: planID,
      }),
    };
    await fetch('https://qa.jarney.club/api/degreeplan/terms', requestOption)
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          refreshPlans();
          setAlertMessage('Term(s) removed!');
          setAlertSeverity('success');
          onShowAlert();
          onClose();
        } else {
          setAlertMessage(result.error);
          setAlertSeverity('warning');
          onShowAlert(true);
        }
      });
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>
          Remove Cards from {planName}&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          {cardOptions.map((card) => (
            <input
              type="button"
              value={card.term}
              id={card.plan_term_id}
              key={card}
              className={pStyle.inputBar}
              onClick={(e) => handleCardChange(e)}
            />
          ))}
        </div>
        <Button className={pStyle.cancelButton} onClick={handleClose}>
          CANCEL
        </Button>

        <Button className={pStyle.submitButton} onClick={handleRemove}>
          REMOVE
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                           Edit Plan Name Popup                            *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function EditPlanName(props) {
  const {
    onClose,
    refreshPlans,
    planName,
    planID,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity,
  } = props;

  const [editName, setEditName] = useState(planName);

  const handleClose = () => {
    onClose();
  };
  const handleEdit = (e) => {
    setEditName(e.target.value);
  };
  const handleSaveEdit = () => {
    /* do something API?? pass in the selectedCards arr */
    patchEditName();

    /* Then Close */
  };

  const patchEditName = async () => {
    const requestOption = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    };
    const url = 'https://qa.jarney.club/api/degreeplan/'
      .concat(planID)
      .concat('/plan_name/')
      .concat(editName);
    await fetch(url, requestOption)
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          refreshPlans();
          setAlertMessage('Plan name changed successfully!');
          setAlertSeverity('success');
          onShowAlert();
          onClose();
        } else {
          setAlertMessage(result.error);
          setAlertSeverity('warning');
          onShowAlert(true);
        }
      })
      .catch((error) => {});
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>
          EDIT PLAN NAME&nbsp;&nbsp;&nbsp;&nbsp;
        </div>

        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          <TextField value={editName} onChange={handleEdit} />
        </div>

        <Button className={pStyle.submitButton} onClick={handleSaveEdit}>
          SAVE CHANGE
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                              Add Plan Popup                               *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function AddPlan(props) {
  const {
    onClose,
    createNewPlan,
    onSetIdxLast,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity,
  } = props;

  const [planName, setPlanName] = useState('');

  const handleClose = () => {
    onClose();
  };
  const handleNameChange = (e) => {
    setPlanName(e.target.value);
  };

  const handleAdd = () => {
    /* do something API?? pass in the selectedCards arr */

    if (planName !== '') {
      createNewPlan(planName);
      onClose();
    } else {
      console.log('bad!');
      setAlertMessage('Plan name cannot be blank!');
      setAlertSeverity('warning');
      onShowAlert();
    }
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>
          ADD PLAN&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          <TextField value={planName} onChange={handleNameChange} />
        </div>
        <Button className={pStyle.submitButton} onClick={handleAdd}>
          ADD
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                Remove Plan Popup                          *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function RemovePlan(props) {
  const {
    onClose,
    planName,
    planID,
    refreshPlans,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity,
    onSetIdxLast,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    /* do something API?? pass in the selectedCards arr */
    fetchDelete();
  };

  const fetchDelete = async () => {
    const requestOption = {
      method: 'DELETE',
      headers: { accept: '*/*' },
    };
    await fetch(
      'https://qa.jarney.club/api/degreeplan?plan_id='.concat(planID),
      requestOption
    )
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          onSetIdxLast();
          setAlertMessage('Plan removed!');
          setAlertSeverity('success');
          onShowAlert();
          onClose();
        } else {
          setAlertMessage(result.error);
          setAlertSeverity('warning');
          onShowAlert(true);
        }
      })
      .catch((error) => {});
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>&nbsp;</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          Are you sure you want to remove {planName}?
        </div>
        <Button className={pStyle.cancelButton} onClick={handleClose}>
          CANCEL
        </Button>
        <Button className={pStyle.submitButton} onClick={handleRemove}>
          REMOVE
        </Button>
      </div>
    </div>
  );
}

export { AddSemester, RemoveSemester, EditPlanName, AddPlan, RemovePlan };
