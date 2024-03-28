export default function Index() {
  return ( 
    <p className="text-center p-10">
      <h1 className="p-4 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Welcome to Trans-Maps!
      </h1>

      Trans-Maps is a dissertation project by Hazel Bell for her 4th year of her Computer Science course at the University of Strathclyde.
      <br></br><br></br>
      The goal of this project is to create a community sourced review system for the Trans community to share experiences and inform others of the potential risks associated with different places.
      <br></br><br></br>
      As a dissertation project this is currently a prototype. <b><u>Please do not enter any real information and experiences onto this website.</u></b> The goal currently is to test the effectiveness of this website and how useful it would be to members of the Trans community.
      <br></br><br></br>
      If you would like to review your experience with this system, or get in touch with the author or supervisor (Dr Ryan Gibson) please use the links bellow.
      <br></br><br></br>
      
      <div className="flex rounded-md justify-center">
        <a href="https://forms.office.com/e/Yup8y9eQ0k" aria-current="page" className="px-6 py-4 text-sm font-medium text-black border border-black rounded-s-lg hover:bg-black hover:text-white">
          Survey
        </a>
        <a href="mailto:hazel.bell.2018@uni.strath.ac.uk" className="px-6 py-4 text-sm font-medium text-black border-t border border-black hover:bg-black hover:text-white">
          Author
        </a>
        <a href="mailto:ryan.gibson@uni.strath.ac.uk" className="px-6 py-4 text-sm font-medium text-black border border-black rounded-e-lg hover:bg-black hover:text-white">
          Supervisor
        </a>
      </div>
    </p>
  );
}
