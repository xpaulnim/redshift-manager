import { React } from "react"

class Header extends React.Component {
    render(){
        <div>
            <h1>Redshift Manager</h1>
        </div>
    }
}

export const HeaderComponent = connect((state) => {
    return {}
})(Header)