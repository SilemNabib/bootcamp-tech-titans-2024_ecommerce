import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TogglePassword from '../../Components/TogglePassword';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Successful register');
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-center mb-5 font-bold">DON'T HAVE AN ACCOUNT YET? REGISTER NOW</h2>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label className="font-bold mb-1">Name</label>
        <input
          type="text"
          {...register('name', { required: true })}
          className="mb-* p-2 border border-black rounded-lg focus:outline-none"
        />
        {errors.name && <span className="text-red-500 mb-4">This field is mandatory</span>}

        <label className="font-bold mb-1">Surname(s)</label>
        <input
          type="text"
          {...register('surname', { required: true })}
          className="mb-* p-2 border border-black rounded-lg focus:outline-none"
        />
        {errors.surname && <span className="text-red-500 mb-4 ">This field is mandatory</span>}

        <label className="font-bold mb-1">Email</label>
        <input
          type="email"
          {...register('email', { required: true })}
          className="mb-* p-2 border border-black rounded-lg focus:outline-none"
        />
        {errors.email && <span className="text-red-500 mb-4">This field is mandatory</span>}

        <label className="font-bold mb-1">Password</label>
        <TogglePassword register={register} name="password" />
        {errors.password && <span className="text-red-500 mb-4">This field is mandatory</span>}        

        <label className="font-bold mb-1">Phone number*</label>
        <input
          type="text"
          {...register('prefix')}
          className="mb-4 p-2 border border-black rounded-lg focus:outline-none"
        />

        <div className="mb-4">
          <label className='block mb'>
            <input type="checkbox" {...register('acceptTerms ', { required: true })} /> I have read and accept the terms and conditions of use and purchase and i understand the information on the use of my personal data provided in the Privacy Policy
          </label>
          
          {errors.acceptTerms && <span className="text-red-500 ">Please accept the Privacy Policy</span>}
        </div>
        
        <div className="mb-4">
          <label>
            <input type="checkbox" {...register('remindMe')} /> Remind me
          </label>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:font-bold"
        >
          CREATE ACCOUNT
        </button>
      </form>
    </div>
  );
};

export default Register;