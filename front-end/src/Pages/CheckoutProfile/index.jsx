import AddresseeInfo from "../../Components/AddresseeInfo";
import OrderSummary from "../../Components/OrderSummary";
import ProgressBar from "../../Components/ProgressBar";

const registerSteps = [
  <a href={"/checkout/profile"}>Select destination</a>,
  <a href={"/checkout/shipping"}>New address</a>,
  <a href={"/checkout/cart"}>Summary</a>,
  <a href={"/checkout/payment"}>Payment</a>,
];
const CheckoutProfile = () => {
    return (
      <div className="flex flex-col items-center">
        <ProgressBar steps={registerSteps} currentStep={0} title="Checkout progress" />
        <div className="flex flex-col md:flex-row justify-center md:justify-between mt-10">
          <div className="md:w-3/5 mb-4 md:mb-0 mt-4">
            <AddresseeInfo />
          </div>
          <div className="md:w-2/6">
            <OrderSummary />
          </div>
        </div>
      </div>
    );
  };

export default CheckoutProfile;