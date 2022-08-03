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

const columnTitles = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "TimeUnspecified",
];

const lol = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7]

const palette = [
  {
    backgroundColor: "#BECADA",
    color: "#000000",
  },
  {
    backgroundColor: "#C8DCE4",
    color: "#000000",
  },
  {
    backgroundColor: "#E2B6B6",
    color: "#000000",
  },
  {
    backgroundColor: "#D2C6CE",
    color: "#000000",
  },
  {
    backgroundColor: "#CBE1B7",
    color: "#000000",
  },
  {
    backgroundColor: "#ECD0AC",
    color: "#000000",
  },
  {
    backgroundColor: "#F0E5A8",
    color: "#000000",
  },
];

function Class(props) {
  const { classDetail, tu, customStyle } = props;
  const {
    name,
    details,
    location,
    instructors,
    time_start,
    time_end,
    term_section_id,
    term_course_id,
  } = classDetail;
  const detail = details.split(",");
  const loc = location.split(",");

  return (
    <div className={eStyle.classContainer} style={customStyle}>
      {!tu && (
        <div>
          {time_start}&nbsp;~&nbsp;{time_end}
        </div>
      )}
      <div>{detail[0]}</div>
      <div>{detail[1]}</div>
      <div>{loc[0]}</div>
    </div>
  );
}

function EventScreenshot(props) {
  const { classDetails, onClose } = props;
  // const [paletteIdx, setPaletteIdx] = useState(0);
  const [classCSS, setClassCSS] = useState({});
  let sectionIDCSS = {};

  const setClassPalette = () => {
    // let paletteIdx = 0;
    columnTitles.forEach((title) => {
      classDetails[title].forEach((detail) => {
        if (!sectionIDCSS.hasOwnProperty(detail.term_course_id)) {
          let startHour = detail.time_start.split;
          detail.term_course_id = palette[lol[startHour - 8]];

          // sectionIDCSS = {
          //   ...sectionIDCSS,
          //   [detail.term_course_id]: palette[paletteIdx],
          // };
          // paletteIdx <= palette.length - 1 ? paletteIdx++ : (paletteIdx = 0);
        }

        // if (!sectionIDCSS.hasOwnProperty(detail.term_course_id)) {
        //   sectionIDCSS = {
        //     ...sectionIDCSS,
        //     [detail.term_course_id]: palette[paletteIdx],
        //   };
        //   paletteIdx <= palette.length - 1 ? paletteIdx++ : (paletteIdx = 0);
        // }
      });
    });
    setClassCSS(sectionIDCSS);
  };

  useEffect(() => {
    setClassPalette();
  }, []);

  return (
    <div className={eStyle.screenshotContainer}>
      <div className={eStyle.headerContainer}>
        <Button onClick={onClose} className={eStyle.button}>
          X
        </Button>
        <div className={eStyle.title}>Take A Screenshot of Your Schedule!</div>
        <Button className={eStyle.invisibleButton}>X</Button>
      </div>
      <div className={eStyle.rowContainer}>
        {columnTitles.map((title) =>
          title === "TimeUnspecified" && classDetails[title].length === 0
            ? null
            : 
          <div className={eStyle.eventsContainer}>
            <div className={eStyle.titleContainer}>
              {title !== "TimeUnspecified" ? title : "Time Unstated"}
            </div>
            {classDetails[title]?.map((details) => (
              <Class
                classDetail={details}
                tu={title === "TimeUnspecified"}
                customStyle={classCSS[details.term_course_id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventScreenshot;
