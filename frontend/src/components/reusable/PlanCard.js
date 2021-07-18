/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * PlanCard.js
 *
 *
 */

import CourseSearchBar from "./CourseSearchBar";
import pStyle from "./reusableStyles/PlanCard.module.css";

function PlanCard(props) {
  const { cardDetail, dropItem } = props;
  const dragOver = (e) => {
    e.preventDefault();

    console.log("hey", e);
    console.log("ondragover: ", e);
  };

  const drop = (e) => {
    const data = e.dataTransfer.getData("id");
    console.log("drop: ", data, e);
    dropItem();
  };

  return (
    <div
      className={pStyle.cardContainer}
      onDragOver={dragOver}
      onDrop={drop}
      id={cardDetail.plan_term_id}
    >
      <div className={pStyle.cardTitle}>{cardDetail.plan_term_id}</div>
      <div className={pStyle.courseContainer}>
        {cardDetail.courses?.map((course) => (
          <CourseSearchBar courseDetail={course} />
        ))}
      </div>
    </div>
  );
}

export default PlanCard;
