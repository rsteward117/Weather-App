import react, {useState} from "react";
import { ReactDOM } from "react";

function ReactRenderElement(){
    const root = ReactDOM.createRoot(
        document.getElementById('root')
      );
      const element = (<h1>Hello, world</h1>);

    return(
        <>
            <div id="root"></div>
            {root.render(element)}
        </>
    )
}

export default ReactRenderElement;