
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Paypal = () => {
    const initialOptions = {
        clientId:"AcxOuXi-0t9YDBwNJetY4q4tCw1dHur_QTR-NHGMwUEl0_JEZEIAns6alXAo0Wh-OFsDO2UfxDlqFBqO" ,
        // Add other options as needed
    };

    const styles = {
        shape: "rect",
        layout: "horizontal",
        label:'pay'
     
    };
    return (
        <div className="App">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons style={styles}/>
            </PayPalScriptProvider>
        </div>
    );
}

export default Paypal;