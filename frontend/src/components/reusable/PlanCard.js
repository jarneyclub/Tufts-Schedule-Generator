/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * PlanCard.js
 *
 *
 */

import pStyle from "./reusableStyles/PlanCard.module.css";

function PlanCard(props) {
  const { cardName, onDragOver, onDrop } = props;
  // const handleDragOver = (e) => {
  //   console.log("hey", e);
  //   e.preventDefault();
  //   console.log("ondragover: ", e)

  // }

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const data = e.dataTransfer.getData("id");
  //   console.log("drop: " , data);
  // }

  return (
    <div className={pStyle.cardContainer}>
      <div className={pStyle.cardTitle}>{cardName}</div>
      <div
        className={pStyle.courseContainer}
        id={cardName}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
    </div>
  );
}

export default PlanCard;
