import React from 'react'
import PageTitle from '../Components/PageTitle'

const HomePage = () => {

    return (
        <div>
            <PageTitle titleText="Calendar Demo" />
            <div>
                <img
                    alt=""
                    src="/src/images/CalendarIcon.png"
                    width="30%"
                    height="30%"
                />
            </div>
        </div>
    );

}

export default HomePage;