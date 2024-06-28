import AddresseeInfo from "../../Components/AddresseeInfo";
import OrderSummary from "../../Components/OrderSummary";
import ProgressBar from "../../Components/ProgressBar";

const registerSteps = [
  "Select destination",
  "New address",
  "Summary",
  "Payment",
];

/**
 * Renders the CheckoutProfile component.
 * This component displays the checkout progress bar, addressee information, and order summary.
 *
 * @returns {JSX.Element} The rendered CheckoutProfile component.
 */
const CheckoutProfile = () => {
    return (
      <div className="flex flex-col items-center w-full">
        <ProgressBar steps={registerSteps} currentStep={0} title="Checkout progress" />
        <div className="flex flex-col md:flex-row justify-around items-center mt-10 w-full">
          <div className="md:w-3/5 mb-4 md:mb-0 mt-4 p-4">
            <AddresseeInfo />
          </div>
          <div className="md:w-2/6">
            <OrderSummary text={"CONTINUE"} to={"/checkout/summary"}/>
          </div>
        </div>
      </div>
    );
  };

  

export default CheckoutProfile;