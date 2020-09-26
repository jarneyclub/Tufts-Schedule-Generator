//checks if two integers overlap
async function average ( x , y ) {
    return Math.ceil(( x + y ) / 2);
}

// checks if two integer intervals overlap x = [ [a..], b, c ] and y = [ [i..], j, k ]
// Note: assumes x < y
// Return: boolean ( true if overlap, false if not overlap 0) 
async function checkOverlap ( x, y ) {
    let x_days_amnt = x[0].length;
    let y_days_amnt = y[0].length;
    // iterate over the days for the given section times of x
    for ( var i = 0; i < x_days_amnt; i++ ) {
        // iterate over the days for the given section times of y
        for ( var j = 0; j < y_days_amnt; j++ ) {
            //check if the day matches
            if ( x[0][i] == y[0][j] ) {

                let xAverage = average ( x[1] , x[2] );
                let yAverage = average ( y[1] , y[2] );
                    
                //assumption
                let interval_difference = Math.abs( xAverage - yAverage );
                
                //check the difference between the interval averages
                if ( interval_difference > ( ( x[2] - xAverage ) + ( y[2] - yAverage ) ) ) {
                    return false;
                }
                else {
                    return true;
                }         
            }
        }
    }
}



exports.average = average;
exports.checkOverlap = checkOverlap;
