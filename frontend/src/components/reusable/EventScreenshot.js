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
const customStyleDefault = {backgroundColor : "#ffffff", color:"#000000"};
const palette = [
  {backgroundColor:"#ffffff", color: "#a0c3d1", borderLeft: "5px solid #a0c3d1"},
  {backgroundColor:"#ffffff", color: "#7048d5", borderLeft: "5px solid #7048d5"}, 
  {backgroundColor:"#ffffff", color: "#FC6D6D", borderLeft: "5px solid #FC6D6D"}, 
  {backgroundColor:"#f0e4aa", color: "#50514F", borderLeft: "5px solid #50514F"}, 
  {backgroundColor:"#ffffff", color: "#70C1B3", borderLeft: "5px solid #70C1B3"}, 
  {backgroundColor:"#ffffff", color: "#247BA0", borderLeft: "5px solid #7247BA"}, 
  {backgroundColor:"#ffffff", color: "#7048d5", borderLeft: "5px solid #7048d5"}, 

]
function Class(props) {
  const { classDetail, tu, customStyle } = props;
  const { name, details, location, instructors, time_start, time_end, term_section_id} = classDetail;
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
        if(!sectionIDCSS.hasOwnProperty(detail.term_section_id)) {
          console.log("detail id:" , detail.term_section_id)
          // setSectionIDCSS((prev) => ({
          //   ...prev,
          //   [detail.term_section_id]: palette[paletteIdx],
          // }))
          sectionIDCSS = {
            ...sectionIDCSS, 
            [detail.term_section_id]: palette[paletteIdx]
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
            {
              classDetails[title]?.map((details) => (
                <Class classDetail={details} tu={title === "TimeUnspecified"} customStyle={classCSS[details.term_section_id]}/>
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
