import useState from 'react';

export default function Child({name,send}) {

    const data = "This is some data from Child component";

    return (<>
    <h1>Child Component: {name}</h1>
    <p>This is a child component.</p>
    <button onClick={() => send(data)}>Show Data</button>
    </>)

}