import { useEffect, useState } from "react";
import {
  Button,
  InputAdornment,
  TextField,
  IconButton,
  CircularProgress,
} from "@material-ui/core";

import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import dp2Style from "../style/DegreePlan2.module.css";
import tStyle from "./reusableStyles/TabSwitch.module.css";
import DegreeReqDisplay from "../reusable/DegreeReqDisplay";
import PlanCard from "./PlanCard";

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
    await fetch("https://jarney.club/api/degreereqs/private")
      .then((response) => {
        console.log("get request response:", response);
        return response.json();
      })
      .then((result) => {
        console.log("get request result of semester plan: ", result);

        if (result.reqs.length === 0) {
          console.log("no private reqs");
        } else {
          setDegreeReqOptions(result.reqs);
        }
      })
      .catch((error) => {
        console.log("error from Degreeplan fetchPrivateReqs ", error);
      });
  };

  useEffect(() => {
    fetchPrivateReqs();
  }, []);

  {
    /* Degree Requirment Container */
  }
  return (
    <div className={dp2Style.degreeReqContainer}>
      <div className={dp2Style.degreeReqTitleContainer}>
        <IconButton onClick={() => handleSwitchReq(-1)}>
          <ArrowLeftIcon fontSize="large" />
        </IconButton>
        <div style={{ color: "#ffffff" }}>
        ✓
        </div>
        <IconButton color="action" onClick={() => handleSwitchReq(1)}>
          <ArrowRightIcon fontSize="large" />
        </IconButton>
      </div>
      <div className={dp2Style.degreeReqDetailContainer}>
        <DegreeReqDisplay reqDetail={degreeReqOptions[selectedDegreeReq]} />
      </div>
    </div>
  );
}


function DegreePlanExpress() {
  const [degreePlanOptions, setDegreePlanOptions] = useState([]);
  const [selectedDegreePlan, setSelectedDegreePlan] = useState(0);

  const handleSwitchReq = (direction) => {
    if (selectedDegreePlan === degreePlanOptions.length - 1 && direction === 1) {
      setSelectedDegreePlan(0);
    } else if (selectedDegreePlan === 0 && direction === -1) {
      setSelectedDegreePlan(degreePlanOptions.length - 1);
    } else {
      setSelectedDegreePlan((prev) => prev + direction);
    }
  };

  const fetchPlans = async () => {
    await fetch("https://jarney.club/api/degreeplans")
      .then((response) => {
        console.log("get request response:", response);
        return response.json();
      })
      .then((result) => {
        console.log("get request result of semester plan: ", result);

        if (result.plans.length === 0) {
          console.log("no private reqs");
        } else {
          setDegreePlanOptions(result.plans);
        }
      })
      .catch((error) => {
        console.log("error from Degreeplan fetchPlans ", error);
      });
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  {
    /* Degree Requirment Container */
  }
  return (
    <div className={dp2Style.degreeReqContainer}>
      <div className={dp2Style.degreeReqTitleContainer}>
        <IconButton onClick={() => handleSwitchReq(-1)}>
          <ArrowLeftIcon fontSize="large" />
        </IconButton>
        <div style={{ color: "#ffffff" }}>
          {degreePlanOptions[selectedDegreePlan]?.plan_name}
        </div>
        <IconButton color="action" onClick={() => handleSwitchReq(1)}>
          <ArrowRightIcon fontSize="large" />
        </IconButton>
      </div>
      <div className={dp2Style.degreeReqDetailContainer}>
        {degreePlanOptions && 
          degreePlanOptions[selectedDegreePlan]?.terms?.map((card) => (
            <PlanCard key={card.plan_term_id} cardDetail={card} tabExpress={true} cardOrigin={"degreePlanExpress"}/>
          ))
          
        }
        
      </div>
    </div>
  );
}

const CourseInfoExpress = (props) => {
  const { courseInfo } = props;
  
  const {details, location, name, time_start, time_end, term_section_id, instructor, course_num, course_title, units_esti} = courseInfo;



  return(
    <div> 
      course_num && 
      {
        <div>
          <div className={tStyle.infoTitle}>Course title: </div>
          <div className={tStyle.infoDetail}>{course_num}</div>
        </div>
        
      }
      
      course_title && 
      {
        <div>
          <div className={tStyle.infoTitle}>Course title: </div>
          <div classname={tStyle.infoDetail}>{course_title}</div>
        </div>
        
      }
      units_esti && 
      {
        <div>
          <div className={tStyle.infoTitle}>SHUs: </div>
          <div classname={tStyle.infoDetail}>{units_esti}</div>
        </div>
        
      }
      time_start && 
      {
        <div>
          <div classname={tStyle.infoDetail}>{time_start}~{time_end}</div>
        </div>
        
      }
      details && 
      {
        <div>
          <div className={tStyle.infoTitle}>Course: </div>
          <div classname={tStyle.infoDetail}>{details}</div>
        </div>
        
      }
      location && 
      {
        <div>
          <div classname={tStyle.infoDetail}>{location}</div>
        </div>
      }
      name && 
      {
        <div>
          <div className={tStyle.infoTitle}>Section detail: </div>
          <div classname={tStyle.infoDetail}>{name}</div>
        </div>
        
      }
      instructor && 
      {
        <div>
          <div className={tStyle.infoTitle}>Instructor: </div>
          <div classname={tStyle.infoDetail}>{instructor}</div>
        </div>
        
      }
    </div>
    
  );
}

export { DegreeReqExpress, DegreePlanExpress, CourseInfoExpress };
