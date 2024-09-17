import React from 'react'

const PageTitle = (props: {titleText: string} ) => {

    return <h1 className="theme-medium-blue-font fw-bold mb-4">{props.titleText}</h1> 
}

export default PageTitle;