/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * EventScreenshot.js
 *
 *
 */

import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import eStyle from "./reusableStyles/EventScreenshot.module.css";

const columnTitles = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "TimeUnspecified"]

const palette = [
  {backgroundColor:"#BECADA", color: "#000000", borderLeft: "5px solid #849AB8"},
  {backgroundColor:"#C8DCE4", color: "#000000", borderLeft: "5px solid #91BACA"}, 
  {backgroundColor:"#E2B6B6", color: "#000000", borderLeft: "5px solid #CF8A8A"}, 
  {backgroundColor:"#D2C6CE", color: "#000000", borderLeft: "5px solid #AA92A1"}, 
  {backgroundColor:"#F0E5A8", color: "#000000", borderLeft: "5px solid #EAD986"}, 
  {backgroundColor:"#CBE1B7", color: "#000000", borderLeft: "5px solid #A1C97D"}, 
  {backgroundColor:"#ECD0AC", color: "#000000", borderLeft: "5px solid #DCAB6A"}, 

]
function Class(props) {
  const { classDetail, tu, customStyle } = props;
  const { name, details, location, instructors, time_start, time_end, term_section_id, term_course_id} = classDetail;
  const detail = details.split(',');
  const loc = location.split(',');

  return (
    <div className={eStyle.classContainer} style={customStyle}>
      {
        !tu && <div>{time_start}&nbsp;~&nbsp;{time_end}</div>
      }
      <div>{detail[0]}</div>
      <div>{detail[1]}</div>
      <div>{name}</div>
      <div>{loc[0]}</div>
    </div>
  )


}


function EventScreenshot(props) {
  const { classDetails, onClose } = props;

  // const [paletteIdx, setPaletteIdx] = useState(0);
  const [classCSS, setClassCSS] =  useState({});
  let sectionIDCSS = {};
  console.log("eventScreenshot:", classDetails);
  
  const setClassPalette = () => {
    let paletteIdx = 0;
    columnTitles.forEach((title) => {
      classDetails[title].forEach(detail  => {
        if(!sectionIDCSS.hasOwnProperty(detail.term_course_id)) {
          console.log("detail id:" , detail.term_course_id)
          // setSectionIDCSS((prev) => ({
          //   ...prev,
          //   [detail.term_section_id]: palette[paletteIdx],
          // }))
          sectionIDCSS = {
            ...sectionIDCSS, 
            [detail.term_course_id]: palette[paletteIdx]
          }
          console.log("sectionIDCSS", sectionIDCSS);
          (paletteIdx <= (palette.length - 1)) ? (paletteIdx++) : (paletteIdx = 0);
          console.log("paletteIdx: ", paletteIdx);
        }
      })
    })
    setClassCSS(sectionIDCSS);
    
    
  }
  useEffect(() => {
    setClassPalette();
  }, [])
    

  return (
    <div className={eStyle.screenshotContainer}>
      <Button onClick={onClose} className={eStyle.button}>Return to scheduler</Button>
      <br/>
      <br/>
      <div className={eStyle.rowContainer}>
        {
        columnTitles.map((title) => (
          <div className={eStyle.eventsContainer}>
            <div className={eStyle.titleContainer}>{title !== "TimeUnspecified" ? title : "Unspecified"}</div>
            <br/>
            {
              classDetails[title]?.map((details) => (
                <Class classDetail={details} tu={title === "TimeUnspecified"} customStyle={classCSS[details.term_course_id]}/>
              ))
            }
          </div>
        ))
      }
      </div>
      
    </div>
  );
}

export default EventScreenshot;
