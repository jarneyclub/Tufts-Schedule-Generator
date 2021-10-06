// globalStyle for font
import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    @font-face {
        font-family: 'Eina03-Regular';
        src: local('Eina03-Regular),
            url('../src/fonts/Eina03-Regular.ttf) format('truetype);
        font-weight: normal;
        font-style: normal;
    };
    @font-face {
        font-family: 'Eina03-SemiBold';
        src: local('Eina03-SemiBold'), 
            url('../src/fonts/Eina03-SemiBold.ttf') format('truetype');
        font-weight: bold;
        font-style: normal;
    };
`;
