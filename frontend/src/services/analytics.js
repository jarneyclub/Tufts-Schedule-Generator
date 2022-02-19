/* This is the SDK you can use for logging frontend usage data. */

const saveFrontendUse = (feature, data) => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({feature: feature, data: data}),
    };

    fetch('https://qa.jarney.club/api/bingbong', requestOption)
      .then(response => {})
      .catch(error => {});
};

export default saveFrontendUse;
