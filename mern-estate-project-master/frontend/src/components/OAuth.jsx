

const OAuth = () => {

  const handleGoogleClick = () => {

    window.location.href = "https://mern-estate-project-eta.vercel.app/auth/google"
  }


  return (
    <button onClick={handleGoogleClick} type="button" className='bg-red-700 rounded-lg p-3 text-white hover:bg-red-600'>Continue with Google</button>
  );
};

export default OAuth