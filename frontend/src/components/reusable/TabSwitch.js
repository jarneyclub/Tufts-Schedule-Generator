import { useEffect, useState } from 'react';
import {
  Button,
  InputAdornment,
  TextField,
  IconButton,
  CircularProgress,
} from '@material-ui/core';

import React from 'react';

import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import dpStyle from '../style/DegreePlan.module.css';
import tStyle from './reusableStyles/TabSwitch.module.css';
import DegreeReqDisplay from '../reusable/DegreeReqDisplay';
import PlanCard from './PlanCard';

function DegreeReqExpress() {
  const [degreeReqOptions, setDegreeReqOptions] = useState([]);
  const [selectedDegreeReq, setSelectedDegreeReq] = useState(0);

  const handleSwitchReq = (direction) => {
    if (selectedDegreeReq === degreeReqOptions.length - 1 && direction === 1) {
      setSelectedDegreeReq(0);
    } else if (selectedDegreeReq === 0 && direction === -1) {
      setSelectedDegreeReq(degreeReqOptions.length - 1);
    } else {
      setSelectedDegreeReq((prev) => prev + direction);
    }
  };

  const fetchPrivateReqs = async () => {
    await fetch('https://qa.jarney.club/api/degreereqs/private')
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.reqs.length === 0) {
        } else {
          setDegreeReqOptions(result.reqs);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchPrivateReqs();
  }, []);

  {
    /* Degree Requirment Container */
  }
  return (
    <div className={dpStyle.degreeReqContainer}>
      <div className={dpStyle.degreeReqTitleContainer}>
        <IconButton onClick={() => handleSwitchReq(-1)}>
          <ArrowLeftIcon fontSize="large" />
        </IconButton>
        <div style={{ color: '#ffffff' }}>✓</div>
        <IconButton color="action" onClick={() => handleSwitchReq(1)}>
          <ArrowRightIcon fontSize="large" />
        </IconButton>
      </div>
      <div className={dpStyle.degreeReqDetailContainer}>
        <DegreeReqDisplay reqDetail={degreeReqOptions[selectedDegreeReq]} />
      </div>
    </div>
  );
}

function DegreePlanExpress() {
  const [degreePlanOptions, setDegreePlanOptions] = useState([]);
  const [selectedDegreePlan, setSelectedDegreePlan] = useState(0);

  const handleSwitchReq = (direction) => {
    if (
      selectedDegreePlan === degreePlanOptions.length - 1 &&
      direction === 1
    ) {
      setSelectedDegreePlan(0);
    } else if (selectedDegreePlan === 0 && direction === -1) {
      setSelectedDegreePlan(degreePlanOptions.length - 1);
    } else {
      setSelectedDegreePlan((prev) => prev + direction);
    }
  };

  const fetchPlans = async () => {
    await fetch('https://qa.jarney.club/api/degreeplans')
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.plans.length === 0) {
        } else {
          setDegreePlanOptions(result.plans);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  {
    /* Degree Requirment Container */
  }
  return (
    <div className={dpStyle.degreeReqContainer}>
      <div className={dpStyle.degreeReqTitleContainer}>
        <IconButton onClick={() => handleSwitchReq(-1)}>
          <ArrowLeftIcon fontSize="large" />
        </IconButton>
        <div style={{ color: '#ffffff' }}>
          {degreePlanOptions[selectedDegreePlan]?.plan_name}
        </div>
        <IconButton color="action" onClick={() => handleSwitchReq(1)}>
          <ArrowRightIcon fontSize="large" />
        </IconButton>
      </div>
      <div className={dpStyle.degreeReqDetailContainer}>
        {degreePlanOptions &&
          degreePlanOptions[selectedDegreePlan]?.terms?.map((card) => (
            <PlanCard
              key={card.plan_term_id}
              cardDetail={card}
              tabExpress={true}
              cardOrigin={'degreePlanExpress'}
            />
          ))}
      </div>
    </div>
  );
}

const CourseInfoExpress = (props) => {
  const { courseInfo, onClose } = props;

  const {
    details,
    location,
    name,
    time_start,
    time_end,
    term_section_id,
    instructors,
    course_num,
    course_title,
    units_esti,
    description,
    attributes,
  } = courseInfo;

  const [attributeDetails, setAttributeDetails] = useState('');
  useEffect(() => {
    attributes?.forEach((att) => {
      setAttributeDetails((prev) => prev.concat(att).concat(', '));
    });
  }, []);

  return (
    <div className={tStyle.courseInfoContainer}>
      <div style={{ color: "#919da1" }}>{course_num}&nbsp;</div>
      <div style={{ color: "#919da1" }}>{course_title}</div>

      {units_esti && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoTitle}>SHUs:&nbsp;</div>
          <div classname={tStyle.infoDetail}>{units_esti}</div>
        </div>
      )}

      {time_start && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoTitle}>Time:&nbsp;</div>
          <div className={tStyle.infoDetail}>
            {time_start}~{time_end}
          </div>
        </div>
      )}

      {details && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoDetail}>{details}</div>
        </div>
      )}

      {location && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoTitle}>Location:&nbsp;</div>
          <div className={tStyle.infoDetail}>{location}</div>
        </div>
      )}

      {name && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoTitle}>Section:&nbsp;</div>
          <div className={tStyle.infoDetail}>{name}</div>
        </div>
      )}

      {instructors && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoTitle}>Instructor:&nbsp;</div>
          <div className={tStyle.infoDetail}>{instructors}</div>
        </div>
      )}

      {attributes && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoTitle}>Attributes:&nbsp;</div>
          <div className={tStyle.infoDetail}>{attributeDetails}</div>
        </div>
      )}

      {description && (
        <div className={tStyle.infoContainer}>
          <div className={tStyle.infoDetail}>{description}</div>
        </div>
      )}
    </div>
  );
};

export { DegreeReqExpress, DegreePlanExpress, CourseInfoExpress };
