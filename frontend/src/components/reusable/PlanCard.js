/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * PlanCard.js
 *
 *
 */

import CourseSearchBar from "./CourseSearchBar";
import pStyle from "./reusableStyles/PlanCard.module.css";

function PlanCard(props) {
  const {
    cardDetail,
    dropItem,
    onRemoveCourse,
    transferCourseDetail,
    onTransferCourse,
    cardOrigin,
    handleCardOrigin,
    tabExpress,
    onClick,
    origin
  } = props;
  
  const dragOver = (e) => {
    e.preventDefault();
  };

  /*
   *  drop()
   *  purpose: when course is dropped onto a planCard
   */
  const drop = (e) => {
    if (
      dropItem(cardDetail.plan_term_id, transferCourseDetail) &&
      cardOrigin !== cardDetail.plan_term_id
    ) {
      onRemoveCourse(cardOrigin, transferCourseDetail);
    }
  };

  /*
   *  handleDoubleClick()
   *  purpose: removes course from plancard when clicked
   *
   */
  const handleDoubleClick = (courseDetail) => {
    console.log("transferCourseDetail: ", transferCourseDetail);
    onRemoveCourse(cardDetail.plan_term_id, courseDetail);
  };

  return (
    <div
      className={pStyle.cardContainer}
      onDragOver={dragOver}
      onDrop={drop}
      id={cardDetail?.plan_term_id}
      style={origin === "dp2" &&  {maxWidth: "33%", minWidth:"300px"}}
    >
      <div className={pStyle.cardTitle}>{cardDetail?.term}</div>
      <div className={pStyle.courseContainer}>
        {tabExpress
          ? cardDetail?.courses?.map((course) => (
              <CourseSearchBar
                draggable={false}
                courseDetail={course}
                key={course.gen_course_id}
                onTransferCourse={onTransferCourse}
                origin={cardOrigin}
                handleCardOrigin={handleCardOrigin}
                onDoubleClick={handleDoubleClick}
                customStyle={{
                  border: "none",
                  justifyContent: "space-between",
                }}
                onClick={onClick}
              />
            ))
          : cardDetail.courses?.map((course) => (
              <CourseSearchBar
                draggable={true}
                courseDetail={course}
                key={course.gen_course_id}
                onTransferCourse={onTransferCourse}
                origin={cardDetail.plan_term_id}
                handleCardOrigin={handleCardOrigin}
                onDoubleClick={handleDoubleClick}
                customStyle={{
                  border: "none",
                  justifyContent: "space-between",
                }}
                onClick={onClick}
              />
            ))}
      </div>
    </div>
  );
}

export default PlanCard;
