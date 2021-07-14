/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * WelcomePage.js
 *
 *
 */

import wStyle from "./style/WelcomePage.module.css";

/* scripts */

function WelcomePage() {
  return (
    <div className={wStyle.container}>
      {/* <Header></Header> */}
      <h2>Welcome back!</h2>
      <div className={wStyle.horizontalWrapper}>
        <a href="/DegreePlan1.js">
          <input
            type="button"
            className={wStyle.navButton}
            value="Degree Plan"
          />
        </a>
        <a href="/Scheduler.js">
          <input type="button" className={wStyle.navButton} value="Scheduler" />
        </a>
      </div>
    </div>
  );
}

export default WelcomePage;
